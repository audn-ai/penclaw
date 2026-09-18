import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { n as isAbortError } from "./abort-signal-DEbc_zqk.js";
import { n as agentCommandFromIngress } from "./agent-command-CxzoW4-d.js";
import {
  i as resolveAgentOutboundTarget,
  n as resolveAgentDeliveryPlanWithSessionRoute,
  r as resolveAgentExplicitRecipientSession,
} from "./agent-delivery-B5NNkGfd.js";
import {
  f as getAgentEventLifecycleGeneration,
  i as clearAgentRunContext,
  r as claimAgentRunContext,
  t as assertAgentRunLifecycleGenerationCurrent,
} from "./agent-events-D4UsOPeT.js";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  n as buildAgentRunTerminalOutcome,
  o as normalizeAgentRunTimeoutPhase,
} from "./agent-run-terminal-outcome-C_WnQaQy.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import { s as resolveTrustedGroupId } from "./agent-tools.policy-BQgyHzcD.js";
import { n as resolveGatewayAssistantAvatar } from "./assistant-avatar-D8GYUW8a.js";
import { n as resolveAssistantIdentity } from "./assistant-identity-CQSUJYSy.js";
import {
  i as parseMessageWithAttachments,
  n as MediaOffloadError,
  o as resolveChatAttachmentMaxBytes,
  t as normalizeRpcAttachmentsToChatAttachments,
} from "./attachment-normalize-6nV4PWtm.js";
import {
  i as parseExecApprovalFollowupApprovalId,
  n as consumeExecApprovalFollowupRuntimeHandoff,
  r as isExecApprovalFollowupSessionRebound,
} from "./bash-tools.exec-approval-followup-state-BoIXP4tQ.js";
import { n as shouldDowngradeDeliveryToSessionOnly } from "./best-effort-delivery-uosomAyH.js";
import "./method-scopes-DrxGpKMT.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DB_q64I6.js";
import {
  f as updateChatRunProvider,
  l as resolveAgentRunExpiresAtMs,
  s as registerChatAbortController,
} from "./chat-abort-DGc7CDOP.js";
import { t as getCliSessionBinding } from "./cli-session-binding-CfY4fqsE.js";
import { t as clearAllCliSessions } from "./cli-session-DWiGjR21.js";
import {
  a as hasGatewayClientCap,
  i as GATEWAY_CLIENT_NAMES,
  r as GATEWAY_CLIENT_MODES,
  t as GATEWAY_CLIENT_CAPS,
} from "./client-info-Br1guPTt.js";
import {
  i as mergeDeliveryContext,
  o as normalizeDeliveryContext,
  s as normalizeSessionDeliveryFields,
} from "./delivery-context.shared-WPZGmi9R.js";
import {
  a as finalizeTaskRunByRunId,
  r as createRunningTaskRun,
} from "./detached-task-runtime-DYTrA0lL.js";
import { n as emitDiagnosticEvent } from "./diagnostic-events-5-gsFhkM.js";
import "./message-channel-NQc9DJ6B.js";
import { t as hasProviderOwnedSession } from "./entry-freshness-DUBhQwKp.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./model-selection-DOlkTrQa.js";
import { i as formatUncaughtError, s as readErrorName } from "./errors-BoHeli7m.js";
import { u as isTimeoutError } from "./failover-error-CYvhrluQ.js";
import {
  d as retainGatewayRootWorkAdmissionContinuation,
  p as runWithGatewayIndependentRootWorkContinuation,
} from "./gateway-work-admission-yGjmBAjy.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-jOYXwwnX.js";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-C7CduG15.js";
import {
  c as shouldPreserveUserFacingSessionStateForInputProvenance,
  n as annotateInterSessionPromptText,
  s as normalizeInputProvenance,
} from "./input-provenance-Xst3EirW.js";
import {
  c as resolveTerminalMainSessionTranscriptRegistryCheck,
  i as hasTerminalMainSessionTranscriptNewerThanRegistrySync,
  o as resolveSessionLifecycleTimestamps,
  s as resolveSessionWorkStartError,
} from "./lifecycle-5_TQ_dr5.js";
import {
  i as resolveExplicitAgentSessionKey,
  r as resolveAgentMainSessionKey,
} from "./main-session-nrmKYo2W.js";
import "./sessions-CEG7v41b.js";
import {
  r as isInternalNonDeliveryChannel,
  t as INTERNAL_MESSAGE_CHANNEL,
} from "./message-channel-constants-CvbXi0yz.js";
import {
  i as normalizeMessageChannel,
  n as isGatewayMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-normalize-Be6uJOzO.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DMpABeI4.js";
import { t as isCliProvider } from "./model-selection-cli-BGoUsby5.js";
import { m as isFutureDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import {
  i as resolveSessionFilePathOptions,
  r as resolveSessionFilePath,
} from "./paths-TfuVT-K8.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import {
  a as resolveSessionResetPolicy,
  i as evaluateSessionFreshness,
  n as resolveSessionResetType,
  t as resolveChannelResetConfig,
} from "./reset-DwjOm4Ug.js";
import {
  i as createAgentRunRestartAbortError,
  n as AGENT_RUN_RESTART_ABORT_STOP_REASON,
  s as isAgentRunRestartAbortReason,
} from "./run-termination-BEbihwT8.js";
import {
  i as clearEmbeddedAgentRunAbortabilityForRunId,
  u as isEmbeddedAgentRunAbortableForRunId,
  w as retainEmbeddedAgentRunAbortabilityForRunId,
} from "./runs-GL_-RIwi.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { n as resolveSendPolicy } from "./send-policy-2la2ZHDC.js";
import {
  Jt as resolveSessionStoreKey,
  Kt as canonicalizeSpawnedByForAgent,
  O as patchSessionEntryTarget,
  o as applySessionEntryReplacements,
  z as readTranscriptStatsSync,
} from "./session-accessor-PZVNxFCV.js";
import {
  n as setGatewayDedupeEntry,
  r as waitForAgentJob,
  t as emitSessionsChanged,
} from "./session-change-event-D7K-El-z.js";
import {
  d as resolveAgentIdFromSessionKey,
  s as classifySessionKeyShape,
} from "./session-key-druuY-GG.js";
import {
  c as parseAgentSessionKey,
  f as parseThreadSessionSuffix,
  l as parseCronRunScopeSuffix,
  n as isAcpSessionKey,
  u as parseRawSessionConversationRef,
} from "./session-key-utils-B8sNp9l4.js";
import { r as readAcpSessionMeta } from "./session-meta-IQvNG5NK.js";
import { n as resolveSessionModelRef } from "./session-model-ref-1c6_XVhy.js";
import {
  a as emitGatewaySessionEndPluginHook,
  c as performGatewaySessionReset,
  o as emitGatewaySessionStartPluginHook,
} from "./session-reset-service-DmIkbVGF.js";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-BUp0DZlF.js";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-BOgjVPnL.js";
import {
  f as resolveDeletedAgentIdFromSessionKey,
  m as resolveGatewayModelSupportsImages,
  u as loadSessionEntry,
} from "./session-utils-DjTWBI0J.js";
import {
  n as normalizeSpawnedRunMetadata,
  r as resolveIngressWorkspaceOverrideForSessionRun,
} from "./spawned-context-Cp4BOB_e.js";
import {
  n as parseSqliteSessionFileMarker,
  t as formatSqliteSessionFileMarker,
} from "./sqlite-marker-BejbySI1.js";
import {
  n as validateAgentParams,
  r as validateAgentWaitParams,
  t as validateAgentIdentityParams,
} from "./src-CIJf1lT0.js";
import {
  At as resolveAgentHarnessSessionIdMismatchError,
  P as resolveMaintenanceConfigFromInput,
  X as beginSessionWorkAdmission,
  at as consumeSessionWorkAdmissionHandoff,
  kt as resolveAgentHarnessSessionContextError,
  v as mergeSessionEntry,
  xt as AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE,
} from "./store-CzZJhTF6.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./agent-DzWgmb_I.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import { p as hasGeneratedMediaCompletionEvent } from "./subagent-announce-origin-4XzASDS-.js";
import {
  i as hasNewGeneratedMediaTaskForSessionKey,
  n as getGeneratedMediaTaskIdsForSessionKey,
} from "./task-status-access-BVw-UeJU.js";
import { t as isRecoverableTerminalSessionStatus } from "./terminal-status-A3S2hMpU.js";
import { n as resolveAgentTimeoutMs } from "./timeout-CjPlNzdm.js";
import { t as setSafeTimeout } from "./timer-delay-Bw3nwNkv.js";
import { r as createUserTurnTranscriptRecorder } from "./user-turn-transcript-DGJJ5XRn.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import {
  r as resolveVoiceWakeRouteByTrigger,
  t as loadVoiceWakeRoutingConfig,
} from "./voicewake-routing-j3uhTgYy.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/gateway/server-methods/agent-identity.ts
const agentIdentityGetHandler = ({ params, respond, context }) => {
  if (!validateAgentIdentityParams(params)) {
    respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `invalid agent.identity.get params: ${formatValidationErrors(validateAgentIdentityParams.errors)}`,
      ),
    );
    return;
  }
  const agentIdRaw = normalizeOptionalString(params.agentId) ?? "";
  const sessionKeyRaw = normalizeOptionalString(params.sessionKey) ?? "";
  let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
  if (sessionKeyRaw) {
    if (classifySessionKeyShape(sessionKeyRaw) === "malformed_agent") {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid agent.identity.get params: malformed session key "${sessionKeyRaw}"`,
        ),
      );
      return;
    }
    const resolved = resolveAgentIdFromSessionKey(sessionKeyRaw);
    if (agentId && resolved !== agentId) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid agent.identity.get params: agent "${agentIdRaw}" does not match session key agent "${resolved}"`,
        ),
      );
      return;
    }
    agentId = resolved;
  }
  const cfg = context.getRuntimeConfig();
  const identity = resolveAssistantIdentity({
    cfg,
    agentId,
  });
  const avatarProjection = resolveGatewayAssistantAvatar({
    cfg,
    identity,
  });
  const avatarResolution = avatarProjection.resolution;
  respond(
    true,
    {
      ...identity,
      avatar: avatarProjection.avatar,
      avatarSource: avatarResolution ? resolvePublicAgentAvatarSource(avatarResolution) : void 0,
      avatarStatus: avatarResolution?.kind,
      avatarReason: avatarResolution?.kind === "none" ? avatarResolution.reason : void 0,
    },
    void 0,
  );
};
//#endregion
//#region src/gateway/server-methods/agent-dedupe.ts
function resolveAgentDedupeKeys(params) {
  const keys = [`agent:${params.idempotencyKey}`];
  const approvalId = params.execApprovalFollowupApprovalId?.trim();
  if (approvalId) keys.push(`agent:exec-approval-followup:${approvalId}`);
  return uniqueStrings(keys);
}
function readGatewayDedupeEntry(params) {
  for (const key of params.keys) {
    const entry = params.dedupe.get(key);
    if (entry) return entry;
  }
}
function isAcceptedAgentDedupePayload(payload) {
  return typeof payload === "object" && payload !== null && payload.status === "accepted";
}
function isPreRegistrationAbortedAgentDedupePayload(payload) {
  const stopReason = payload?.stopReason;
  return (
    typeof payload === "object" &&
    payload !== null &&
    payload.status === "timeout" &&
    (stopReason === "rpc" || stopReason === "stop")
  );
}
function isPreRegistrationAbortedAgentDedupeEntryForSession(params) {
  if (!params.entry?.ok || !isPreRegistrationAbortedAgentDedupePayload(params.entry.payload))
    return false;
  const payload = params.entry.payload;
  const payloadRunId = typeof payload.runId === "string" ? payload.runId.trim() : "";
  if (payloadRunId && payloadRunId !== params.runId) return false;
  const payloadSessionKey =
    typeof payload.sessionKey === "string" && payload.sessionKey.trim()
      ? payload.sessionKey.trim()
      : void 0;
  const expectedSessionKeys = new Set(
    [params.sessionKey, ...(params.alternateSessionKeys ?? [])].filter((value) =>
      Boolean(value?.trim()),
    ),
  );
  return (
    !payloadSessionKey ||
    expectedSessionKeys.size === 0 ||
    expectedSessionKeys.has(payloadSessionKey)
  );
}
function setGatewayDedupeEntries(params) {
  for (const key of params.keys)
    setGatewayDedupeEntry({
      dedupe: params.dedupe,
      key,
      entry: params.entry,
    });
}
function setAbortedAgentDedupeEntries(params) {
  setGatewayDedupeEntries({
    dedupe: params.dedupe,
    keys: params.keys,
    entry: {
      ts: Date.now(),
      ok: true,
      payload: {
        runId: params.runId,
        ...(params.agentId ? { agentId: params.agentId } : {}),
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
        status: "timeout",
        summary: "aborted",
        stopReason: params.stopReason,
        timeoutPhase: "queue",
        providerStarted: false,
      },
    },
  });
}
//#endregion
//#region src/gateway/server-methods/agent-expected-session.ts
var ExpectedExistingSessionChangedError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ExpectedExistingSessionChangedError";
  }
};
function resolveExpectedExistingSessionConstraint(params) {
  const sessionId = normalizeOptionalString(params.expectedExistingSessionId);
  if (!sessionId) return { ok: true };
  if (!params.canUseInternalRuntimeHandoff)
    return {
      ok: false,
      error: "expectedExistingSessionId is reserved for backend callers.",
    };
  const handoffId = normalizeOptionalString(params.internalRuntimeHandoffId);
  return {
    ok: true,
    constraint: {
      sessionId,
      ...(handoffId ? { handoffId } : {}),
    },
  };
}
function validateExpectedExistingSessionTarget(params) {
  if (!params.constraint) return;
  if (!params.requestedSessionKey)
    return "expectedExistingSessionId requires an explicit session key.";
  if (params.requestedSessionId && params.requestedSessionId !== params.constraint.sessionId)
    return "conflicting session identity constraints.";
}
function assertExpectedExistingSession(params) {
  if (params.constraint && params.entry?.sessionId !== params.constraint.sessionId)
    throw new ExpectedExistingSessionChangedError(params.message);
}
function consumeExpectedSessionWorkAdmission(params) {
  const handoffId = params.constraint?.handoffId;
  if (!handoffId) return;
  const lease = consumeSessionWorkAdmissionHandoff({
    handoffId,
    scope: params.scope,
    identities: params.identities,
    onInterrupt: params.onInterrupt,
  });
  if (!lease) throw new Error("session work admission handoff is unavailable");
  return lease;
}
//#endregion
//#region src/gateway/server-methods/agent-admission-controller.ts
function createAgentAdmissionController(params) {
  let admission;
  let admittedRunAbort;
  let postAdmissionAbort;
  let postAdmissionTimeout;
  let postAdmissionSuperseded = false;
  let lifecycleRotated = false;
  const admissionAgentId = () => {
    const resolvedSessionKey = params.getResolvedSessionKey();
    return (
      params.getResolvedSessionAgentId() ??
      (resolvedSessionKey === "global"
        ? (params.getAgentId() ?? resolveDefaultAgentId(params.getCfgForAgent() ?? params.cfg))
        : void 0)
    );
  };
  const assertAllowed = (commitOutcome = true) => {
    const resolvedSessionKey = params.getResolvedSessionKey();
    const requestedSessionKey = params.getRequestedSessionKey();
    const latest = readGatewayDedupeEntry({
      dedupe: params.context.dedupe,
      keys: params.agentDedupeKeys,
    });
    if (
      isPreRegistrationAbortedAgentDedupeEntryForSession({
        entry: latest,
        runId: params.runId,
        sessionKey: resolvedSessionKey,
        alternateSessionKeys: [params.preAcceptedReservedSessionKey, requestedSessionKey],
      })
    ) {
      if (commitOutcome) postAdmissionAbort = latest;
      return;
    }
    if (params.dedupeLifecycle.isReserved()) {
      if (!latest) {
        if (commitOutcome) {
          postAdmissionTimeout = queueTimeout(params.runId);
          setAbortedAgentDedupeEntries({
            dedupe: params.context.dedupe,
            keys: params.agentDedupeKeys,
            agentId: admissionAgentId(),
            sessionKey: resolvedSessionKey,
            runId: params.runId,
            stopReason: "timeout",
          });
        }
        return;
      }
      if (!latest.ok || !isAcceptedAgentDedupePayload(latest.payload)) {
        if (commitOutcome) postAdmissionAbort = latest;
        return;
      }
      if (latest.payload.reservationId !== params.dedupeLifecycle.reservationId) {
        if (commitOutcome) postAdmissionSuperseded = true;
        return;
      }
      if (!isFutureDateTimestampMs(latest.payload.expiresAtMs, { nowMs: Date.now() })) {
        if (commitOutcome) {
          postAdmissionTimeout = queueTimeout(params.runId);
          setAbortedAgentDedupeEntries({
            dedupe: params.context.dedupe,
            keys: params.agentDedupeKeys,
            agentId: admissionAgentId(),
            sessionKey: resolvedSessionKey,
            runId: params.runId,
            stopReason: "timeout",
          });
        }
        return;
      }
    }
    if (params.lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
      if (commitOutcome)
        lifecycleRotated = params.dedupeLifecycle.abortForLifecycleRotation({
          sessionKey: resolvedSessionKey,
          agentId: admissionAgentId(),
        });
      return;
    }
    if (!resolvedSessionKey) return;
    const admissionAgent = admissionAgentId();
    let latestEntry = loadSessionEntry(resolvedSessionKey, {
      agentId: admissionAgent,
      clone: false,
    }).entry;
    if (!latestEntry && requestedSessionKey && requestedSessionKey !== resolvedSessionKey)
      latestEntry = loadSessionEntry(requestedSessionKey, {
        agentId: admissionAgent,
        clone: false,
      }).entry;
    assertExpectedExistingSession({
      constraint: params.expectedSession,
      entry: latestEntry,
      message: `Session "${resolvedSessionKey}" changed while starting expected work. Retry.`,
    });
    if (params.getSessionPersisted() && !latestEntry)
      throw new Error(`Session "${resolvedSessionKey}" was deleted while starting work. Retry.`);
    const archivedError = resolveSessionWorkStartError(resolvedSessionKey, latestEntry);
    if (archivedError) throw new Error(archivedError);
    if (
      commitOutcome &&
      latestEntry?.sessionId &&
      latestEntry.sessionId !== params.getSupersededSessionId()
    )
      params.setAdmittedSessionId(latestEntry.sessionId);
  };
  const interrupt = () => {
    if (admittedRunAbort?.entry)
      admittedRunAbort.entry.abortStopReason = AGENT_RUN_RESTART_ABORT_STOP_REASON;
    if (admittedRunAbort) {
      admittedRunAbort.controller.abort(createAgentRunRestartAbortError());
      return;
    }
    const reservedEntry = readGatewayDedupeEntry({
      dedupe: params.context.dedupe,
      keys: params.agentDedupeKeys,
    });
    if (
      reservedEntry?.ok &&
      isAcceptedAgentDedupePayload(reservedEntry.payload) &&
      reservedEntry.payload.reservationId === params.dedupeLifecycle.reservationId
    )
      setAbortedAgentDedupeEntries({
        dedupe: params.context.dedupe,
        keys: params.agentDedupeKeys,
        agentId: admissionAgentId(),
        sessionKey: params.getResolvedSessionKey(),
        runId: params.runId,
        stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON,
      });
  };
  const acquire = async (scope) => {
    if (admission) return;
    admission =
      consumeExpectedSessionWorkAdmission({
        constraint: params.expectedSession,
        scope,
        identities: [params.getResolvedSessionKey(), params.getResolvedSessionId()],
        onInterrupt: interrupt,
      }) ??
      (await beginSessionWorkAdmission({
        scope,
        identities: [params.getResolvedSessionKey(), params.getResolvedSessionId()],
        assertAllowed: () => assertAllowed(false),
        revalidateAllowed: assertAllowed,
        onInterrupt: interrupt,
      }));
  };
  const respondToOutcome = () => {
    if (postAdmissionAbort) {
      admission?.release();
      params.dedupeLifecycle.markAccepted(true);
      params.respond(postAdmissionAbort.ok, postAdmissionAbort.payload, postAdmissionAbort.error, {
        cached: true,
        runId: params.runId,
      });
      return true;
    }
    if (postAdmissionTimeout || postAdmissionSuperseded) {
      admission?.release();
      params.dedupeLifecycle.markAccepted(true);
      params.respond(
        true,
        postAdmissionTimeout ?? {
          runId: params.runId,
          status: "in_flight",
        },
        void 0,
        {
          cached: true,
          runId: params.runId,
        },
      );
      return true;
    }
    if (lifecycleRotated) {
      admission?.release();
      return true;
    }
    return false;
  };
  return {
    admissionAgentId,
    assertAllowed,
    acquire,
    respondToOutcome,
    hasOutcome: () =>
      Boolean(
        postAdmissionAbort || postAdmissionTimeout || postAdmissionSuperseded || lifecycleRotated,
      ),
    getAdmission: () => admission,
    getAdmittedRunAbort: () => admittedRunAbort,
    setAdmittedRunAbort: (value) => {
      admittedRunAbort = value;
    },
    release: () => admission?.release(),
  };
}
function queueTimeout(runId) {
  return {
    runId,
    status: "timeout",
    summary: "aborted",
    stopReason: "timeout",
    timeoutPhase: "queue",
    providerStarted: false,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-content-phase.ts
function formatAttachmentFailureForLog(err) {
  const primary = formatUncaughtError(err);
  const cause = err instanceof Error ? err.cause : void 0;
  if (cause === void 0) return primary;
  const causeText = formatUncaughtError(cause);
  return !causeText || causeText === primary ? primary : `${primary}\nCaused by: ${causeText}`;
}
function logAttachmentFailure(logGateway, label, err) {
  logGateway.error(label, {
    error: formatAttachmentFailureForLog(err),
    consoleMessage: `${label}: ${formatForLog(err)}`,
  });
}
async function prepareAgentContentPhase(params) {
  const transcriptInputText = (params.request.message ?? "").trim();
  let message = params.isRawModelRun
    ? transcriptInputText
    : annotateInterSessionPromptText(transcriptInputText, params.inputProvenance);
  let images = [];
  let imageOrder = [];
  let agentId = params.agentId;
  let requestedSessionKey = params.requestedSessionKey;
  if (params.normalizedAttachments.length > 0) {
    let baseProvider;
    let baseModel;
    let requestedAcpMeta;
    if (params.requestedSessionKeyRaw) {
      const { cfg, entry, canonicalKey } = loadSessionEntry(params.requestedSessionKeyRaw, {
        ...(agentId ? { agentId } : {}),
        clone: false,
      });
      const modelRef = resolveSessionModelRef(
        cfg,
        entry,
        canonicalKey === "global" && agentId ? agentId : resolveAgentIdFromSessionKey(canonicalKey),
      );
      baseProvider = modelRef.provider;
      baseModel = modelRef.model;
      requestedAcpMeta = readAcpSessionMeta({ sessionKey: canonicalKey });
    }
    const supportsInlineImages =
      params.request.acpTurnSource === "manual_spawn" &&
      isAcpSessionKey(params.requestedSessionKeyRaw) &&
      requestedAcpMeta != null
        ? true
        : await resolveGatewayModelSupportsImages({
            loadGatewayModelCatalog: params.context.loadGatewayModelCatalog,
            provider: params.providerOverride || baseProvider,
            model: params.modelOverride || baseModel,
          });
    try {
      const parsed = await parseMessageWithAttachments(message, params.normalizedAttachments, {
        maxBytes: resolveChatAttachmentMaxBytes(params.cfg),
        log: params.context.logGateway,
        supportsInlineImages,
        acceptNonImage: false,
      });
      message = parsed.message.trim();
      images = parsed.images;
      imageOrder = parsed.imageOrder;
    } catch (err) {
      logAttachmentFailure(params.context.logGateway, "agent attachment parse failed", err);
      params.respond(
        false,
        void 0,
        errorShape(
          err instanceof MediaOffloadError ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST,
          String(err),
        ),
      );
      return;
    }
  }
  const isKnownGatewayChannel = (value) =>
    isGatewayMessageChannel(value) || isInternalNonDeliveryChannel(value);
  const channelHints = normalizeStringEntries(
    [params.request.channel, params.request.replyChannel].filter(
      (value) => typeof value === "string",
    ),
  );
  for (const rawChannel of channelHints) {
    const normalized = normalizeMessageChannel(rawChannel);
    if (normalized && normalized !== "last" && !isKnownGatewayChannel(normalized)) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid agent params: unknown channel: ${normalized}`,
        ),
      );
      return;
    }
  }
  const voiceWakeTrigger = normalizeOptionalString(params.request.voiceWakeTrigger) ?? "";
  const replyTo = normalizeOptionalString(params.request.replyTo) ?? "";
  const recipientChannel = params.explicitRecipientSession?.channel ?? params.request.channel;
  const recipientAccountId = params.explicitRecipientSession?.accountId ?? params.request.accountId;
  const recipientThreadId = params.explicitRecipientSession?.threadId ?? params.request.threadId;
  const to = params.sessionKeyFromTo
    ? ""
    : (params.explicitRecipientSession?.to ?? params.requestedToRaw ?? "");
  const explicitVoiceWakeSessionTarget =
    !agentId && params.requestedSessionKeyRaw
      ? (() => {
          const { cfg, canonicalKey } = loadSessionEntry(params.requestedSessionKeyRaw, {
            clone: false,
          });
          const routedAgentId = resolveAgentIdFromSessionKey(canonicalKey);
          if (routedAgentId !== normalizeAgentId(resolveDefaultAgentId(cfg))) return true;
          return (
            canonicalKey !==
            resolveAgentMainSessionKey({
              cfg,
              agentId: routedAgentId,
            })
          );
        })()
      : false;
  const canAutoRouteVoiceWake =
    !agentId && !explicitVoiceWakeSessionTarget && !params.requestedSessionId && !replyTo && !to;
  if (Object.hasOwn(params.request, "voiceWakeTrigger") && canAutoRouteVoiceWake)
    try {
      const route = resolveVoiceWakeRouteByTrigger({
        trigger: voiceWakeTrigger || void 0,
        config: await loadVoiceWakeRoutingConfig(),
      });
      if ("agentId" in route)
        if (params.knownAgents.includes(route.agentId)) {
          agentId = route.agentId;
          requestedSessionKey = resolveExplicitAgentSessionKey({
            cfg: params.cfg,
            agentId,
          });
        } else
          params.context.logGateway.warn(
            `voicewake routing ignored unknown agentId="${route.agentId}" trigger="${voiceWakeTrigger}"`,
          );
      else if ("sessionKey" in route)
        if (classifySessionKeyShape(route.sessionKey) !== "malformed_agent") {
          const canonicalKey = loadSessionEntry(route.sessionKey, { clone: false }).canonicalKey;
          const routedAgentId = resolveAgentIdFromSessionKey(canonicalKey);
          if (params.knownAgents.includes(routedAgentId)) {
            requestedSessionKey = canonicalKey;
            agentId = routedAgentId;
          } else
            params.context.logGateway.warn(
              `voicewake routing ignored unknown session agent="${routedAgentId}" sessionKey="${canonicalKey}" trigger="${voiceWakeTrigger}"`,
            );
        } else
          params.context.logGateway.warn(
            `voicewake routing ignored malformed sessionKey="${route.sessionKey}" trigger="${voiceWakeTrigger}"`,
          );
    } catch (err) {
      params.context.logGateway.warn(`voicewake routing load failed: ${formatForLog(err)}`);
    }
  return {
    agentId,
    requestedSessionKey,
    effectiveTranscriptInputText: transcriptInputText,
    message,
    images,
    imageOrder,
    replyTo,
    recipientChannel,
    recipientAccountId,
    recipientThreadId,
    to,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-handler-helpers.ts
const RESET_COMMAND_RE = /^\/(new|reset)(?:\s+([\s\S]*))?$/i;
const CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS = [250, 1e3, 4e3, 15e3];
function clientHasAdminScope(client) {
  return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(
    ADMIN_SCOPE,
  );
}
function respondDeletedAgentSession(params) {
  const deletedAgentId = resolveDeletedAgentIdFromSessionKey(
    params.cfg,
    params.canonicalKey,
    params.entry,
    { acpMetadataSessionKey: params.acpMetadataSessionKey ?? params.canonicalKey },
  );
  if (deletedAgentId === null) return false;
  params.respond(
    false,
    void 0,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `Agent "${deletedAgentId}" no longer exists in configuration`,
    ),
  );
  return true;
}
function respondUnavailableAgentSessionForKey(params) {
  const { cfg, entry, canonicalKey, legacyKey } = loadSessionEntry(params.sessionKey, {
    ...(params.agentId ? { agentId: params.agentId } : {}),
    clone: false,
  });
  if (
    respondDeletedAgentSession({
      cfg,
      canonicalKey,
      entry,
      acpMetadataSessionKey: legacyKey,
      respond: params.respond,
    })
  )
    return true;
  const harnessSessionError = resolveAgentHarnessSessionContextError(canonicalKey, entry);
  if (harnessSessionError) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionError));
    return true;
  }
  const harnessSessionIdError = resolveAgentHarnessSessionIdMismatchError(
    entry,
    params.requestedSessionId,
  );
  if (harnessSessionIdError) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionIdError));
    return true;
  }
  if (params.isRawModelRun && entry?.modelSelectionLocked === true) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE),
    );
    return true;
  }
  const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
  if (!archivedSessionError) return false;
  params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
  return true;
}
function resolveAllowModelOverrideFromClient(client) {
  return clientHasAdminScope(client) || client?.internal?.allowModelOverride === true;
}
function resolveCanUseInternalRuntimeHandoff(client) {
  return client?.connect?.client?.mode === GATEWAY_CLIENT_MODES.BACKEND;
}
function resolveCanUseCronRunContinuation(client) {
  return client?.internal?.cronRunContinuation === true;
}
function cronContinuationHasReusableRuntime(params) {
  const executionProvider =
    resolveCliRuntimeExecutionProvider({
      provider: params.provider,
      cfg: params.cfg,
      agentId: params.agentId,
      modelId: params.model,
    }) ?? params.provider;
  return (
    !isCliProvider(executionProvider, params.cfg) ||
    Boolean(getCliSessionBinding(params.entry, executionProvider)?.sessionId)
  );
}
function withoutCronRunContinuation(entry) {
  const { cronRunContinuation: _cronRunContinuation, ...baseEntry } = entry;
  return baseEntry;
}
function emitAgentSendSessionLifecycleTransition(transition) {
  if (!transition) return;
  if (transition.previousSessionId)
    emitGatewaySessionEndPluginHook({
      cfg: transition.cfg,
      sessionKey: transition.sessionKey,
      sessionId: transition.previousSessionId,
      storePath: transition.storePath,
      sessionFile: transition.previousSessionFile,
      agentId: transition.agentId,
      reason: transition.previousEndReason ?? "unknown",
      nextSessionId: transition.sessionId,
      nextSessionKey: transition.sessionKey,
    });
  emitGatewaySessionStartPluginHook({
    cfg: transition.cfg,
    sessionKey: transition.sessionKey,
    sessionId: transition.sessionId,
    resumedFrom: transition.previousSessionId,
    storePath: transition.storePath,
    sessionFile: transition.sessionFile,
    agentId: transition.agentId,
  });
}
function shouldSuppressAgentPromptPersistence(params) {
  return (
    params.inputProvenance?.kind === "inter_session" &&
    params.inputProvenance.sourceTool === "subagent_announce" &&
    params.internalEvents?.some(
      (event) => event.type === "task_completion" && event.source === "subagent",
    ) === true
  );
}
function withSqliteSessionFileMarker(params) {
  const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
  if (!agentId) return params.entry;
  const sessionFile = formatSqliteSessionFileMarker({
    agentId,
    sessionId: params.entry.sessionId,
    storePath: params.storePath,
  });
  return params.entry.sessionFile === sessionFile
    ? params.entry
    : {
        ...params.entry,
        sessionFile,
      };
}
function yieldAfterAgentAcceptedAck() {
  return new Promise((resolve) => {
    setTimeout(resolve, 10);
  });
}
function waitForCronContinuationReleaseRecovery(delayMs) {
  return new Promise((resolve) => {
    setSafeTimeout(resolve, delayMs).unref?.();
  });
}
//#endregion
//#region src/gateway/server-methods/agent-cron-continuation.ts
function createCronContinuationController(params) {
  let claim;
  let recoveryScheduled = false;
  const release = async (outcome) => {
    const activeClaim = claim;
    if (!activeClaim) return true;
    const baseSessionKey = parseCronRunScopeSuffix(activeClaim.sessionKey).baseSessionKey;
    for (let attempt = 1; attempt <= 3; attempt += 1)
      try {
        const released = await applySessionEntryReplacements({
          activeSessionKey: activeClaim.sessionKey,
          requireWriteSuccess: true,
          sessionKeys:
            baseSessionKey && baseSessionKey !== activeClaim.sessionKey
              ? [activeClaim.sessionKey, baseSessionKey]
              : [activeClaim.sessionKey],
          skipMaintenance: false,
          storePath: activeClaim.storePath,
          update: (entries) => {
            const entriesByKey = new Map(
              entries.map(({ sessionKey, entry }) => [sessionKey, entry]),
            );
            let current = entriesByKey.get(activeClaim.sessionKey);
            const marker = current?.cronRunContinuation;
            if (
              !current ||
              marker?.phase !== "continuing" ||
              marker.ownerRunId !== params.runId ||
              marker.lifecycleRevision !== activeClaim.lifecycleRevision
            )
              return { result: false };
            const continuationCommittedWork =
              outcome?.terminalOutcome.reason === "completed" ||
              hasNewGeneratedMediaTaskForSessionKey(
                activeClaim.sessionKey,
                activeClaim.mediaTaskIdsBefore,
              );
            if (!continuationCommittedWork) current = structuredClone(activeClaim.initialEntry);
            else if (outcome?.terminalOutcome) {
              current.status =
                outcome.terminalOutcome.status === "ok"
                  ? "done"
                  : outcome.terminalOutcome.status === "timeout"
                    ? "timeout"
                    : "failed";
              current.endedAt = outcome.terminalOutcome.endedAt ?? Date.now();
            }
            const baseEntry = baseSessionKey ? entriesByKey.get(baseSessionKey) : void 0;
            const canPersistToBase =
              baseSessionKey !== void 0 &&
              baseSessionKey !== activeClaim.sessionKey &&
              baseEntry?.lifecycleRevision === activeClaim.lifecycleRevision;
            const replacements = [];
            if (continuationCommittedWork && canPersistToBase && baseEntry && baseSessionKey)
              replacements.push({
                sessionKey: baseSessionKey,
                entry: mergeSessionSnapshotChanges({
                  initial: withoutCronRunContinuation(activeClaim.initialEntry),
                  next: withoutCronRunContinuation(current),
                  current: baseEntry,
                }),
              });
            const {
              ownerRunId: _ownerRunId,
              ownerLifecycleGeneration: _ownerLifecycleGeneration,
              ...releasedMarker
            } = continuationCommittedWork
              ? marker
              : (activeClaim.initialEntry.cronRunContinuation ?? marker);
            const baseWasSuperseded = Boolean(
              baseEntry && baseEntry.lifecycleRevision !== activeClaim.lifecycleRevision,
            );
            current.cronRunContinuation = {
              ...releasedMarker,
              phase: "ready",
              basePersisted:
                releasedMarker.basePersisted === true || canPersistToBase || baseWasSuperseded,
            };
            current.updatedAt = Date.now();
            replacements.push({
              sessionKey: activeClaim.sessionKey,
              entry: current,
            });
            return {
              replacements,
              result: true,
            };
          },
        });
        claim = void 0;
        if (released && baseSessionKey)
          emitSessionsChanged(params.context, {
            sessionKey: baseSessionKey,
            reason: "cron-continuation",
          });
        return released;
      } catch (error) {
        params.context.logGateway.warn(
          `failed to release cron continuation ${params.runId} (${attempt}/3): ${formatForLog(error)}`,
        );
      }
    return false;
  };
  const releaseWithRecovery = async (outcome, onRecovered) => {
    const released = await release(outcome);
    const recoveryClaim = claim;
    if (released || !recoveryClaim || recoveryScheduled) return released;
    recoveryScheduled = true;
    runWithGatewayIndependentRootWorkContinuation(async () => {
      for (const delayMs of CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS) {
        await waitForCronContinuationReleaseRecovery(delayMs);
        if (
          claim !== recoveryClaim ||
          getAgentEventLifecycleGeneration() !== params.lifecycleGeneration
        )
          return;
        if (await release(outcome)) {
          try {
            onRecovered?.();
          } catch (error) {
            params.context.logGateway.warn(
              `failed to refresh recovered cron continuation dedupe ${params.runId}: ${formatForLog(error)}`,
            );
          }
          return;
        }
      }
      params.context.logGateway.warn(
        `cron continuation release recovery exhausted for ${params.runId}`,
      );
    });
    return false;
  };
  return {
    releaseWithRecovery,
    setClaim: (value) => {
      claim = value;
    },
  };
}
//#endregion
//#region src/gateway/server-methods/agent-task-tracking.ts
function normalizeTrustedGroupMetadata(value) {
  return {
    groupId: normalizeOptionalString(value?.groupId),
    groupChannel: normalizeOptionalString(value?.groupChannel),
    groupSpace: normalizeOptionalString(value?.groupSpace ?? value?.space),
  };
}
function resolveSessionKeyGroupId(sessionKey) {
  const { baseSessionKey } = parseThreadSessionSuffix(sessionKey);
  const conversation = parseRawSessionConversationRef(baseSessionKey ?? sessionKey);
  if (!conversation || (conversation.kind !== "group" && conversation.kind !== "channel")) return;
  return conversation.rawId;
}
function resolveTrustedGroupMetadata(params) {
  return {
    groupId:
      params.stored.groupId ??
      params.inherited?.groupId ??
      resolveSessionKeyGroupId(params.sessionKey) ??
      (params.spawnedBy ? resolveSessionKeyGroupId(params.spawnedBy) : void 0),
    groupChannel: params.stored.groupChannel ?? params.inherited?.groupChannel,
    groupSpace: params.stored.groupSpace ?? params.inherited?.groupSpace,
  };
}
function requestGroupMatchesTrusted(params) {
  const requestGroupId = params.requestGroupId?.trim();
  if (!requestGroupId) return true;
  return Boolean(params.trustedGroupId && requestGroupId === params.trustedGroupId);
}
function resolveGatewayAgentTaskTrackingMode(params) {
  if (params.modelRun === true) return "none";
  if (!params.sessionKey?.trim() || params.inputProvenance?.kind === "inter_session") return "none";
  if (params.client?.internal?.agentRunTracking === "plugin_subagent") return "plugin_subagent";
  if (params.confirmedAcpManualSpawn) return "none";
  return "cli";
}
function isTrustedBackendAcpSpawnClient(client) {
  return (
    client?.connect?.client?.id === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT &&
    client.connect.client.mode === GATEWAY_CLIENT_MODES.BACKEND &&
    client.isDeviceTokenAuth !== true
  );
}
function isConfirmedAcpManualSpawnTaskOwner(params) {
  const sessionKey = params.sessionKey;
  if (
    !isTrustedBackendAcpSpawnClient(params.client) ||
    params.acpTurnSource !== "manual_spawn" ||
    sessionKey == null ||
    !isAcpSessionKey(sessionKey)
  )
    return false;
  try {
    return readAcpSessionMeta({ sessionKey }) != null;
  } catch (err) {
    params.logGateway.warn(
      `failed to read ACP session metadata for manual-spawn task tracking ${sessionKey}; falling back to cli task tracking: ${formatForLog(err)}`,
    );
    return false;
  }
}
async function registerPluginSubagentRunFromGateway(params) {
  const childSessionKey = params.childSessionKey.trim();
  if (!childSessionKey) return;
  const ownerSessionKey = resolveAgentMainSessionKey({
    cfg: params.cfg,
    agentId: resolveAgentIdFromSessionKey(childSessionKey),
  });
  const { registerSubagentRun } = await import("./subagent-registry-rYOVFcxo.js");
  registerSubagentRun({
    runId: params.runId,
    childSessionKey,
    controllerSessionKey: ownerSessionKey,
    requesterSessionKey: ownerSessionKey,
    requesterOrigin: params.requesterOrigin,
    requesterDisplayKey: "main",
    task: params.task,
    cleanup: "keep",
    ...(params.pluginId ? { label: `plugin:${params.pluginId}` } : {}),
    expectsCompletionMessage: false,
    spawnMode: "run",
  });
}
function resolveFailedTrackedAgentTaskStatus(error) {
  return isAbortError(error) || isTimeoutError(error) ? "timed_out" : "failed";
}
function tryFinalizeTrackedAgentTask(params) {
  try {
    finalizeTaskRunByRunId({
      runId: params.runId,
      runtime: "cli",
      status: params.status,
      endedAt: Date.now(),
      ...(params.error !== void 0 ? { error: params.error } : {}),
      ...(params.terminalSummary !== void 0 ? { terminalSummary: params.terminalSummary } : {}),
    });
  } catch (err) {
    params.log.warn(`failed to finalize tracked agent task ${params.runId}: ${formatForLog(err)}`);
  }
}
//#endregion
//#region src/gateway/server-methods/agent-run-dispatch.ts
function readAgentRunTimeoutAttribution(meta) {
  const record = meta && typeof meta === "object" && !Array.isArray(meta) ? meta : void 0;
  return {
    timeoutPhase: normalizeAgentRunTimeoutPhase(record?.timeoutPhase),
    providerStarted: asBoolean(record?.providerStarted),
  };
}
function isGatewayAbortSignalReason(reason) {
  return reason === void 0 || isAbortError(reason) || readErrorName(reason) === "TimeoutError";
}
function isGatewayAgentAbortRejection(error, signal) {
  if (!signal.aborted) return false;
  if (isAgentRunRestartAbortReason(signal.reason)) return true;
  if (readErrorName(signal.reason) === "TimeoutError") return true;
  if (!isGatewayAbortSignalReason(signal.reason)) return false;
  return isAbortError(error) || readErrorName(error) === "TimeoutError";
}
function resolveGatewayAgentAbortStopReason(signal) {
  if (isAgentRunRestartAbortReason(signal.reason)) return "restart";
  return readErrorName(signal.reason) === "TimeoutError" ? "timeout" : "rpc";
}
function resolveAbortedAgentStopReason(entry) {
  return entry?.abortStopReason?.trim() || "rpc";
}
function deleteGatewayDedupeEntries(params) {
  for (const key of params.keys) params.dedupe.delete(key);
}
function dispatchAgentRunFromGateway(params) {
  const shouldTrackTask = params.taskTrackingMode === "cli";
  let taskTracked = false;
  if (shouldTrackTask)
    try {
      taskTracked = Boolean(
        createRunningTaskRun({
          runtime: "cli",
          sourceId: params.runId,
          ownerKey: params.ingressOpts.sessionKey,
          scopeKind: "session",
          requesterOrigin: normalizeDeliveryContext({
            channel: params.ingressOpts.channel,
            to: params.ingressOpts.to,
            accountId: params.ingressOpts.accountId,
            threadId: params.ingressOpts.threadId,
          }),
          childSessionKey: params.ingressOpts.sessionKey,
          runId: params.runId,
          task: params.ingressOpts.message,
          deliveryStatus: "not_applicable",
          startedAt: Date.now(),
        }),
      );
    } catch (err) {
      params.context.logGateway.warn(
        `failed to start tracked agent task ${params.runId}: ${formatForLog(err)}`,
      );
    }
  const settle = async (outcome) => {
    try {
      return (await params.onSettled?.(outcome)) ?? true;
    } catch (error) {
      params.context.logGateway.warn(
        `failed to settle agent continuation ${params.runId}: ${formatForLog(error)}`,
      );
      return false;
    }
  };
  agentCommandFromIngress(params.ingressOpts, defaultRuntime, params.context.deps)
    .then(async (result) => {
      const aborted = result?.meta?.aborted === true;
      const timeoutAttribution = readAgentRunTimeoutAttribution(result?.meta);
      if (taskTracked)
        tryFinalizeTrackedAgentTask({
          runId: params.runId,
          status: aborted ? "timed_out" : "succeeded",
          terminalSummary: aborted ? "aborted" : "completed",
          log: params.context.logGateway,
        });
      const payload = {
        runId: params.runId,
        status: aborted ? "timeout" : "ok",
        summary: aborted ? "aborted" : "completed",
        ...(aborted ? { stopReason: result?.meta?.stopReason ?? "rpc" } : {}),
        ...(aborted && timeoutAttribution.timeoutPhase
          ? { timeoutPhase: timeoutAttribution.timeoutPhase }
          : {}),
        ...(aborted && timeoutAttribution.providerStarted !== void 0
          ? { providerStarted: timeoutAttribution.providerStarted }
          : {}),
        result,
      };
      const terminalOutcome = buildAgentRunTerminalOutcome({
        status:
          aborted || result?.meta?.stopReason === "timeout" || timeoutAttribution.timeoutPhase
            ? "timeout"
            : result?.meta?.error || result?.meta?.stopReason === "error"
              ? "error"
              : "ok",
        error: result?.meta?.error,
        stopReason: result?.meta?.stopReason,
        livenessState: result?.meta?.livenessState,
        timeoutPhase: timeoutAttribution.timeoutPhase,
        providerStarted: timeoutAttribution.providerStarted,
      });
      const persistTerminalDedupe = () => {
        setGatewayDedupeEntries({
          dedupe: params.context.dedupe,
          keys: params.dedupeKeys,
          entry: {
            ts: Date.now(),
            ok: true,
            payload,
          },
        });
      };
      if (
        !(await settle({
          terminalOutcome,
          onRecovered: persistTerminalDedupe,
        }))
      ) {
        const summary = "failed to persist cron continuation settlement";
        const error = errorShape(ErrorCodes.UNAVAILABLE, summary);
        const failedPayload = {
          runId: params.runId,
          status: "error",
          summary,
        };
        setGatewayDedupeEntries({
          dedupe: params.context.dedupe,
          keys: params.dedupeKeys,
          entry: {
            ts: Date.now(),
            ok: false,
            payload: failedPayload,
            error,
          },
        });
        params.respond(false, failedPayload, error, {
          runId: params.runId,
          error: summary,
        });
        return;
      }
      persistTerminalDedupe();
      params.respond(true, payload, void 0, { runId: params.runId });
    })
    .catch(async (err) => {
      const aborted = isGatewayAgentAbortRejection(err, params.abortController.signal);
      const renderedErr = formatForLog(err);
      if (taskTracked)
        tryFinalizeTrackedAgentTask({
          runId: params.runId,
          status: aborted ? "timed_out" : resolveFailedTrackedAgentTaskStatus(err),
          error: renderedErr,
          terminalSummary: renderedErr,
          log: params.context.logGateway,
        });
      const error = errorShape(ErrorCodes.UNAVAILABLE, renderedErr);
      const stopReason = resolveGatewayAgentAbortStopReason(params.abortController.signal);
      const terminalOutcome = buildAgentRunTerminalOutcome({
        status: aborted ? "timeout" : "error",
        error: renderedErr,
        stopReason,
        timeoutPhase: aborted ? "gateway_draining" : void 0,
      });
      const payload = {
        runId: params.runId,
        status: aborted ? "timeout" : "error",
        summary: aborted ? "aborted" : renderedErr,
        ...(aborted
          ? {
              stopReason,
              timeoutPhase: "gateway_draining",
            }
          : {}),
      };
      const persistTerminalDedupe = (settlementPersisted) => {
        setGatewayDedupeEntries({
          dedupe: params.context.dedupe,
          keys: params.dedupeKeys,
          entry: {
            ts: Date.now(),
            ok: aborted && settlementPersisted,
            payload,
            ...(aborted ? {} : { error }),
          },
        });
      };
      const settled = await settle({
        terminalOutcome,
        onRecovered: () => persistTerminalDedupe(true),
      });
      persistTerminalDedupe(settled);
      params.respond(aborted && settled, payload, aborted && settled ? void 0 : error, {
        runId: params.runId,
        ...(aborted ? {} : { error: formatForLog(err) }),
      });
    })
    .finally(() => {
      clearAgentRunContext(params.runId, params.ingressOpts.lifecycleGeneration);
      params.cleanupAbortController();
    });
}
//#endregion
//#region src/gateway/server-methods/agent-session-reset.ts
async function runSessionResetFromAgent(params) {
  const result = await performGatewaySessionReset({
    key: params.key,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    reason: params.reason,
    commandSource: "gateway:agent",
    assertCurrent: params.assertCurrent,
    onCommitted: params.onCommitted,
  });
  if (!result.ok) return result;
  return {
    ok: true,
    key: result.key,
    sessionId: result.entry.sessionId,
  };
}
function sessionResetAckText(reason) {
  return reason === "new" ? "✅ New session started." : "✅ Session reset.";
}
function buildBareSessionResetResult(params) {
  return {
    payloads: [{ text: params.ackText ?? sessionResetAckText(params.reason) }],
    meta: {
      durationMs: 0,
      ...(params.sessionId ? { agentMeta: { sessionId: params.sessionId } } : {}),
    },
  };
}
function buildBareSessionResetResponse(params) {
  return {
    runId: params.runId,
    status: "ok",
    summary: "completed",
    result: params.result,
  };
}
async function deliverBareSessionResetResult(params) {
  const { deliverAgentCommandResult } = await import("./delivery.runtime.js");
  params.assertCurrent?.();
  const result = buildBareSessionResetResult({
    reason: params.reason,
    sessionId: params.sessionId,
    ackText: params.ackText,
  });
  return await deliverAgentCommandResult({
    cfg: params.cfg,
    deps: params.context.deps,
    runtime: defaultRuntime,
    opts: {
      message: params.ackText ?? sessionResetAckText(params.reason),
      ...(params.agentId ? { agentId: params.agentId } : {}),
      ...(params.sessionId ? { sessionId: params.sessionId } : {}),
      sessionKey: params.sessionKey,
      deliver: true,
      replyTo: params.request.replyTo,
      to: params.request.to,
      replyChannel: params.request.replyChannel,
      channel: params.request.channel,
      replyAccountId: params.request.replyAccountId,
      accountId: params.request.accountId,
      threadId: params.request.threadId,
      deliveryTargetMode: params.deliveryTargetMode,
      bestEffortDeliver: params.bestEffortDeliver,
      runId: params.runId,
      messageChannel: params.originMessageChannel,
      runContext: {
        messageChannel: params.originMessageChannel,
        accountId: params.request.replyAccountId ?? params.request.accountId,
        currentThreadTs: params.request.threadId != null ? String(params.request.threadId) : void 0,
      },
      allowModelOverride: false,
    },
    outboundSession: void 0,
    sessionEntry: params.sessionEntry,
    result,
    payloads: result.payloads,
    assertDeliveryCurrent: params.assertCurrent,
  });
}
async function resolveBareSessionResetResult(params) {
  params.assertCurrent?.();
  if (params.request.deliver !== true)
    return buildBareSessionResetResult({
      reason: params.reason,
      sessionId: params.sessionId,
      ackText: params.ackText,
    });
  if (
    resolveSendPolicy({
      cfg: params.cfg,
      entry: params.sessionEntry,
      sessionKey: params.sessionKey,
      channel: params.sessionEntry?.channel,
      chatType: params.sessionEntry?.chatType,
    }) === "deny"
  )
    throw new Error("send blocked by session policy");
  const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
    currentSessionKey: params.sessionKey,
    sessionEntry: params.sessionEntry,
    requestedChannel:
      normalizeOptionalString(params.request.replyChannel) ??
      normalizeOptionalString(params.request.channel),
    explicitTo:
      normalizeOptionalString(params.request.replyTo) ?? normalizeOptionalString(params.request.to),
    explicitThreadId: normalizeOptionalString(params.request.threadId),
    accountId:
      normalizeOptionalString(params.request.replyAccountId) ??
      normalizeOptionalString(params.request.accountId),
    wantsDelivery: true,
    turnSourceChannel: normalizeOptionalString(params.request.channel),
    turnSourceTo: normalizeOptionalString(params.request.to),
    turnSourceAccountId: normalizeOptionalString(params.request.accountId),
    turnSourceThreadId: normalizeOptionalString(params.request.threadId),
  });
  params.assertCurrent?.();
  const mainSessionKey = resolveAgentMainSessionKey({
    cfg: params.cfg,
    agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
  });
  const bestEffortDeliver =
    typeof params.request.bestEffortDeliver === "boolean"
      ? params.request.bestEffortDeliver
      : params.sessionKey === mainSessionKey || params.sessionKey === "global"
        ? true
        : void 0;
  return await deliverBareSessionResetResult({
    cfg: params.cfg,
    context: params.context,
    reason: params.reason,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    sessionEntry: params.sessionEntry,
    request: {
      ...params.request,
      channel: deliveryPlan.resolvedChannel,
      to: deliveryPlan.resolvedTo ?? deliveryPlan.baseDelivery.to,
      accountId: deliveryPlan.resolvedAccountId ?? deliveryPlan.baseDelivery.accountId,
      threadId: deliveryPlan.resolvedThreadId,
    },
    bestEffortDeliver,
    deliveryTargetMode: deliveryPlan.deliveryTargetMode ?? deliveryPlan.baseDelivery.mode,
    originMessageChannel: params.originMessageChannel ?? deliveryPlan.resolvedChannel,
    runId: params.runId,
    assertCurrent: params.assertCurrent,
    ackText: params.ackText,
  });
}
function loadBareSessionResetDeliverySession(params) {
  const selectedGlobalAgentId =
    params.sessionKey === "global" && params.agentId ? params.agentId : void 0;
  const loaded = loadSessionEntry(params.sessionKey, {
    clone: false,
    ...(selectedGlobalAgentId ? { agentId: selectedGlobalAgentId } : {}),
  });
  const loadedCfg = loaded?.cfg ?? params.cfg;
  return {
    cfg: loadedCfg,
    entry: loaded?.entry,
    agentId:
      selectedGlobalAgentId ??
      resolveAgentIdFromSessionKey(params.sessionKey) ??
      resolveDefaultAgentId(loadedCfg),
  };
}
function resolveSessionRuntimeCwd(params) {
  return normalizeOptionalString(params.requestedCwd ?? params.sessionEntry?.spawnedCwd);
}
//#endregion
//#region src/gateway/server-methods/agent-dedupe-lifecycle.ts
function createAgentDedupeLifecycle(params) {
  let reserved = false;
  let accepted = false;
  let committedResetCompletion;
  const reservationId = randomUUID();
  const reserve = (sessionKey, dedupeAgentId) => {
    if (reserved) return;
    const dedupeSessionResolvesGlobal = sessionKey
      ? resolveSessionStoreKey({
          cfg: params.cfg,
          sessionKey,
        }) === "global"
      : false;
    const acceptedAt = Date.now();
    const pendingTimeoutMs = resolveAgentTimeoutMs({
      cfg: params.cfg,
      overrideSeconds: typeof params.request.timeout === "number" ? params.request.timeout : void 0,
    });
    setGatewayDedupeEntries({
      dedupe: params.context.dedupe,
      keys: params.agentDedupeKeys,
      entry: {
        ts: acceptedAt,
        ok: true,
        payload: {
          runId: params.runId,
          reservationId,
          status: "accepted",
          ...(sessionKey ? { sessionKey } : {}),
          ...(dedupeAgentId && (!sessionKey || dedupeSessionResolvesGlobal)
            ? { agentId: dedupeAgentId }
            : {}),
          controlUiVisible: !params.suppressVisibleSessionEffects,
          acceptedAt,
          dedupeKeys: params.agentDedupeKeys,
          expiresAtMs: resolveAgentRunExpiresAtMs({
            now: acceptedAt,
            timeoutMs: pendingTimeoutMs,
          }),
          ownerConnId: params.ownerConnId,
          ownerDeviceId: params.ownerDeviceId,
        },
      },
    });
    reserved = true;
  };
  const clearUnaccepted = () => {
    if (!reserved || accepted) return;
    const entry = readGatewayDedupeEntry({
      dedupe: params.context.dedupe,
      keys: params.agentDedupeKeys,
    });
    if (
      isPreRegistrationAbortedAgentDedupeEntryForSession({
        entry,
        runId: params.runId,
      }) ||
      (entry?.ok &&
        isAcceptedAgentDedupePayload(entry.payload) &&
        entry.payload.reservationId !== reservationId)
    )
      return;
    deleteGatewayDedupeEntries({
      dedupe: params.context.dedupe,
      keys: params.agentDedupeKeys,
    });
    reserved = false;
  };
  const abortForLifecycleRotation = (target) => {
    if (params.lifecycleGeneration === getAgentEventLifecycleGeneration()) return false;
    if (committedResetCompletion) {
      const completion = committedResetCompletion;
      const responsePayload = buildBareSessionResetResponse({
        runId: params.runId,
        result: buildBareSessionResetResult({
          reason: completion.reason,
          sessionId: completion.sessionId,
          ackText: completion.followUpPending
            ? `${sessionResetAckText(completion.reason)} Gateway restarted before the follow-up ran; send the follow-up message again.`
            : void 0,
        }),
      });
      accepted = true;
      setGatewayDedupeEntries({
        dedupe: params.context.dedupe,
        keys: params.agentDedupeKeys,
        entry: {
          ts: Date.now(),
          ok: true,
          payload: responsePayload,
        },
      });
      params.respond(true, responsePayload, void 0, { runId: params.runId });
      emitSessionsChanged(params.context, {
        sessionKey: completion.sessionKey,
        ...(completion.sessionKey === "global" && completion.agentId
          ? { agentId: completion.agentId }
          : {}),
        reason: completion.reason,
      });
      return true;
    }
    accepted = true;
    setAbortedAgentDedupeEntries({
      dedupe: params.context.dedupe,
      keys: params.agentDedupeKeys,
      agentId: target?.agentId,
      sessionKey: target?.sessionKey,
      runId: params.runId,
      stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON,
    });
    params.respond(
      true,
      {
        runId: params.runId,
        status: "timeout",
        summary: "aborted",
        stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON,
        timeoutPhase: "queue",
        providerStarted: false,
      },
      void 0,
      { runId: params.runId },
    );
    return true;
  };
  return {
    reservationId,
    reserve,
    clearUnaccepted,
    abortForLifecycleRotation,
    isReserved: () => reserved,
    isAccepted: () => accepted,
    markAccepted: (value) => {
      accepted = value;
    },
    setCommittedResetCompletion: (value) => {
      committedResetCompletion = value;
    },
  };
}
//#endregion
//#region src/gateway/server-methods/agent-delivery-phase.ts
async function resolveAgentDeliveryPhase(params) {
  const activeSessionAgentId =
    params.resolvedSessionKey === "global" && params.resolvedSessionAgentId
      ? params.resolvedSessionAgentId
      : params.resolvedSessionKey
        ? resolveAgentIdFromSessionKey(params.resolvedSessionKey)
        : (params.agentId ?? resolveDefaultAgentId(params.cfgForAgent ?? params.cfg));
  const connId = typeof params.client?.connId === "string" ? params.client.connId : void 0;
  if (
    connId &&
    hasGatewayClientCap(params.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TOOL_EVENTS)
  ) {
    params.context.registerToolEventRecipient(params.runId, connId);
    for (const [activeRunId, active] of params.context.chatAbortControllers) {
      const sameSession = active.sessionKey === params.resolvedSessionKey;
      const sameSelectedGlobalAgent =
        params.resolvedSessionKey === "global" ? active.agentId === activeSessionAgentId : true;
      if (activeRunId !== params.runId && sameSession && sameSelectedGlobalAgent)
        params.context.registerToolEventRecipient(activeRunId, connId);
    }
  }
  const wantsDelivery = params.request.deliver === true;
  const explicitThreadId = normalizeOptionalString(params.recipientThreadId);
  const turnSourceChannel = normalizeOptionalString(params.recipientChannel);
  const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
    cfg: params.cfgForAgent ?? params.cfg,
    agentId: activeSessionAgentId,
    currentSessionKey: params.resolvedSessionKey,
    sessionEntry: params.sessionEntry,
    requestedChannel: params.request.replyChannel ?? params.recipientChannel,
    explicitTo: params.replyTo || params.to || void 0,
    explicitThreadId,
    accountId: params.request.replyAccountId ?? params.recipientAccountId,
    wantsDelivery,
    turnSourceChannel,
    turnSourceTo: params.to || void 0,
    turnSourceAccountId: normalizeOptionalString(params.recipientAccountId),
    turnSourceThreadId: explicitThreadId,
  });
  let resolvedChannel = deliveryPlan.resolvedChannel;
  let deliveryTargetMode = deliveryPlan.deliveryTargetMode;
  const resolvedAccountId = deliveryPlan.resolvedAccountId;
  let resolvedTo = deliveryPlan.resolvedTo;
  let effectivePlan = deliveryPlan;
  let deliveryDowngradeReason = null;
  let deliveryTargetResolutionError = deliveryPlan.targetResolutionError;
  if (wantsDelivery && resolvedChannel === "webchat")
    try {
      resolvedChannel = (
        await resolveMessageChannelSelection({ cfg: params.cfgForAgent ?? params.cfg })
      ).channel;
      deliveryTargetMode = deliveryTargetMode ?? "implicit";
      effectivePlan = {
        ...deliveryPlan,
        resolvedChannel,
        deliveryTargetMode,
        resolvedAccountId,
      };
    } catch (err) {
      if (
        !shouldDowngradeDeliveryToSessionOnly({
          wantsDelivery,
          bestEffortDeliver: params.bestEffortDeliver,
          resolvedChannel,
        })
      ) {
        params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
        return;
      }
      deliveryDowngradeReason = String(err);
    }
  if (wantsDelivery && deliveryTargetResolutionError) {
    if (!params.bestEffortDeliver) {
      params.respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, String(deliveryTargetResolutionError)),
      );
      return;
    }
    deliveryDowngradeReason = String(deliveryTargetResolutionError);
    resolvedChannel = INTERNAL_MESSAGE_CHANNEL;
    deliveryTargetMode = void 0;
    resolvedTo = void 0;
    effectivePlan = {
      ...deliveryPlan,
      resolvedChannel,
      resolvedTo,
      deliveryTargetMode,
    };
  }
  if (!resolvedTo && isDeliverableMessageChannel(resolvedChannel)) {
    const fallback = resolveAgentOutboundTarget({
      cfg: params.cfgForAgent ?? params.cfg,
      plan: effectivePlan,
      targetMode: deliveryTargetMode ?? "implicit",
      validateExplicitTarget: false,
    });
    if (fallback.resolvedTarget?.ok) resolvedTo = fallback.resolvedTo;
    else if (fallback.resolvedTarget && !fallback.resolvedTarget.ok)
      deliveryTargetResolutionError = fallback.resolvedTarget.error;
  }
  if (wantsDelivery && isDeliverableMessageChannel(resolvedChannel) && !resolvedTo) {
    if (!params.bestEffortDeliver) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          deliveryTargetResolutionError
            ? String(deliveryTargetResolutionError)
            : `delivery target is required for ${resolvedChannel}: pass --to/--reply-to or configure a default target`,
        ),
      );
      return;
    }
    params.context.logGateway.info(
      deliveryTargetResolutionError
        ? `agent delivery target missing (bestEffortDeliver): ${String(deliveryTargetResolutionError)}`
        : "agent delivery target missing (bestEffortDeliver): no deliverable target",
    );
  }
  if (wantsDelivery && resolvedChannel === "webchat") {
    if (
      !shouldDowngradeDeliveryToSessionOnly({
        wantsDelivery,
        bestEffortDeliver: params.bestEffortDeliver,
        resolvedChannel,
      })
    ) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel",
        ),
      );
      return;
    }
    params.context.logGateway.info(
      deliveryDowngradeReason
        ? `agent delivery downgraded to session-only (bestEffortDeliver): ${deliveryDowngradeReason}`
        : "agent delivery downgraded to session-only (bestEffortDeliver): no deliverable channel",
    );
  }
  const normalizedTurnSource = normalizeMessageChannel(turnSourceChannel);
  const turnSourceMessageChannel =
    normalizedTurnSource &&
    (isGatewayMessageChannel(normalizedTurnSource) ||
      isInternalNonDeliveryChannel(normalizedTurnSource))
      ? normalizedTurnSource
      : void 0;
  return {
    activeSessionAgentId,
    deliveryPlan,
    resolvedChannel,
    deliveryTargetMode,
    resolvedAccountId,
    resolvedTo,
    originMessageChannel:
      turnSourceMessageChannel ??
      (params.client?.connect && params.isWebchatConnect(params.client.connect)
        ? "webchat"
        : resolvedChannel),
    deliver: wantsDelivery && resolvedChannel !== "webchat",
    explicitThreadId,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-request-preflight.ts
function prepareAgentRequestPreflight(params) {
  if (!validateAgentParams(params.params)) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `invalid agent params: ${formatValidationErrors(validateAgentParams.errors)}`,
      ),
    );
    return;
  }
  const request = params.params;
  if (request.cwd && !path.isAbsolute(request.cwd)) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cwd must be absolute"));
    return;
  }
  if (request.cwd && !normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId)) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, "cwd is reserved for plugin-owned subagent runs"),
    );
    return;
  }
  const allowModelOverride = resolveAllowModelOverrideFromClient(params.client);
  const canUseInternalRuntimeHandoff = resolveCanUseInternalRuntimeHandoff(params.client);
  const canUseCronRunContinuation = resolveCanUseCronRunContinuation(params.client);
  const expectedSessionResult = resolveExpectedExistingSessionConstraint({
    canUseInternalRuntimeHandoff,
    expectedExistingSessionId: request.expectedExistingSessionId,
    internalRuntimeHandoffId: request.internalRuntimeHandoffId,
  });
  if (!expectedSessionResult.ok) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, expectedSessionResult.error),
    );
    return;
  }
  const requestedPromptPersistenceSuppression = request.suppressPromptPersistence === true;
  const requestedInternalSessionEffects = request.sessionEffects === "internal";
  const requestedModelOverride = Boolean(request.provider || request.model);
  const isOneShotModelRun = request.modelRun === true;
  const isRawModelRun = isOneShotModelRun || request.promptMode === "none";
  if (request.promptMode === "none" && !isOneShotModelRun) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        'promptMode="none" requires modelRun=true so the run cannot mutate a durable session.',
      ),
    );
    return;
  }
  if (requestedModelOverride && !allowModelOverride) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "provider/model overrides are not authorized for this caller.",
      ),
    );
    return;
  }
  if (
    (requestedInternalSessionEffects || requestedPromptPersistenceSuppression) &&
    !canUseInternalRuntimeHandoff
  ) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "internal session-effect controls are reserved for backend callers.",
      ),
    );
    return;
  }
  const cfg = params.context.getRuntimeConfig();
  const runId = request.idempotencyKey;
  const execApprovalFollowupApprovalId = parseExecApprovalFollowupApprovalId(runId);
  if (execApprovalFollowupApprovalId && !canUseInternalRuntimeHandoff) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "exec approval followup idempotency keys are reserved for backend callers.",
      ),
    );
    return;
  }
  const inputProvenance = normalizeInputProvenance(request.inputProvenance);
  const sessionEffects =
    isOneShotModelRun || requestedInternalSessionEffects ? "internal" : request.sessionEffects;
  const agentDedupeKeys = resolveAgentDedupeKeys({
    idempotencyKey: runId,
    execApprovalFollowupApprovalId,
  });
  const cached = readGatewayDedupeEntry({
    dedupe: params.context.dedupe,
    keys: agentDedupeKeys,
  });
  if (cached) {
    if (cached.ok && isAcceptedAgentDedupePayload(cached.payload)) {
      const cachedRunId =
        typeof cached.payload.runId === "string" && cached.payload.runId.trim()
          ? cached.payload.runId.trim()
          : runId;
      const cachedSessionKey =
        typeof cached.payload.sessionKey === "string" && cached.payload.sessionKey.trim()
          ? cached.payload.sessionKey.trim()
          : void 0;
      const cachedAgentId =
        cachedSessionKey === "global" &&
        typeof cached.payload.agentId === "string" &&
        cached.payload.agentId.trim()
          ? cached.payload.agentId.trim()
          : void 0;
      params.respond(
        true,
        {
          runId: cachedRunId,
          status: "in_flight",
          ...(cachedSessionKey ? { sessionKey: cachedSessionKey } : {}),
          ...(cachedAgentId ? { agentId: cachedAgentId } : {}),
        },
        void 0,
        {
          cached: true,
          runId: cachedRunId,
        },
      );
    } else params.respond(cached.ok, cached.payload, cached.error, { cached: true });
    return;
  }
  return {
    request,
    cfg,
    runId,
    lifecycleGeneration: getAgentEventLifecycleGeneration(),
    allowModelOverride,
    canUseInternalRuntimeHandoff,
    canUseCronRunContinuation,
    expectedSession: expectedSessionResult.constraint,
    expectedExistingSessionId: expectedSessionResult.constraint?.sessionId,
    providerOverride: allowModelOverride ? request.provider : void 0,
    modelOverride: allowModelOverride ? request.model : void 0,
    execApprovalFollowupApprovalId,
    normalizedSpawned: normalizeSpawnedRunMetadata({
      groupId: request.groupId,
      groupChannel: request.groupChannel,
      groupSpace: request.groupSpace,
    }),
    inputProvenance,
    preserveUserFacingSessionModelState:
      canUseInternalRuntimeHandoff &&
      shouldPreserveUserFacingSessionStateForInputProvenance(inputProvenance),
    sessionEffects,
    suppressVisibleSessionEffects: sessionEffects === "internal",
    requestedPromptPersistenceSuppression,
    isOneShotModelRun,
    isRawModelRun,
    agentDedupeKeys,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-request-routing.ts
async function prepareAgentRequestRouting(params) {
  const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(
    params.request.attachments,
  );
  const requestedBestEffortDeliver =
    typeof params.request.bestEffortDeliver === "boolean"
      ? params.request.bestEffortDeliver
      : void 0;
  const knownAgents = listAgentIds(params.cfg);
  const agentIdRaw = normalizeOptionalString(params.request.agentId) ?? "";
  let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
  if (agentId && !knownAgents.includes(agentId)) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `invalid agent params: unknown agent id "${params.request.agentId}"`,
      ),
    );
    return;
  }
  const requestedSessionKeyParam = normalizeOptionalString(params.request.sessionKey);
  const requestedSessionId = normalizeOptionalString(params.request.sessionId);
  const requestedToRaw = normalizeOptionalString(params.request.to);
  const sessionKeyFromTo =
    !requestedSessionKeyParam &&
    !requestedSessionId &&
    classifySessionKeyShape(requestedToRaw) === "agent"
      ? requestedToRaw
      : void 0;
  const requestedSessionKeyRaw = requestedSessionKeyParam ?? sessionKeyFromTo;
  if (
    requestedSessionKeyRaw &&
    classifySessionKeyShape(requestedSessionKeyRaw) === "malformed_agent"
  ) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `invalid agent params: malformed session key "${requestedSessionKeyRaw}"`,
      ),
    );
    return;
  }
  if (!agentId && requestedSessionKeyRaw) {
    const parsed = parseAgentSessionKey(requestedSessionKeyRaw);
    const inferredAgentId =
      parsed &&
      resolveSessionStoreKey({
        cfg: params.cfg,
        sessionKey: requestedSessionKeyRaw,
      }) === "global"
        ? normalizeAgentId(parsed.agentId)
        : void 0;
    if (inferredAgentId && !knownAgents.includes(inferredAgentId)) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid agent params: unknown agent id "${parsed?.agentId}"`,
        ),
      );
      return;
    }
    agentId = inferredAgentId;
  }
  const explicitRecipientChannel = normalizeMessageChannel(params.request.channel);
  const explicitRecipient =
    !requestedSessionKeyRaw &&
    !requestedSessionId &&
    agentId &&
    explicitRecipientChannel &&
    isDeliverableMessageChannel(explicitRecipientChannel) &&
    requestedToRaw
      ? {
          agentId,
          channel: explicitRecipientChannel,
          to: requestedToRaw,
        }
      : void 0;
  let explicitRecipientSession;
  if (explicitRecipient) {
    params.reserveDedupe(void 0, explicitRecipient.agentId);
    try {
      explicitRecipientSession = await resolveAgentExplicitRecipientSession({
        cfg: params.cfg,
        agentId: explicitRecipient.agentId,
        channel: explicitRecipient.channel,
        to: explicitRecipient.to,
        accountId: normalizeOptionalString(params.request.accountId),
        threadId: params.request.threadId,
      });
    } catch (error) {
      params.clearDedupe();
      params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(error)));
      return;
    }
  }
  if (explicitRecipientSession?.error) {
    params.clearDedupe();
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, explicitRecipientSession.error.message),
    );
    return;
  }
  const requestedSessionKey =
    requestedSessionKeyRaw ??
    explicitRecipientSession?.sessionKey ??
    (!requestedSessionId ? resolveAgentExplicitRecipientSessionKey(params.cfg, agentId) : void 0);
  const expectedSessionTargetError = validateExpectedExistingSessionTarget({
    constraint: params.expectedSession,
    requestedSessionId,
    requestedSessionKey,
  });
  if (expectedSessionTargetError) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, expectedSessionTargetError),
    );
    return;
  }
  if (agentId && requestedSessionKeyRaw) {
    const parsed = parseAgentSessionKey(requestedSessionKeyRaw);
    const canonicalKey = resolveSessionStoreKey({
      cfg: params.cfg,
      sessionKey: requestedSessionKeyRaw,
    });
    const sessionAgentId = parsed?.agentId
      ? normalizeAgentId(parsed.agentId)
      : canonicalKey === "global"
        ? agentId
        : resolveAgentIdFromSessionKey(requestedSessionKeyRaw);
    if (sessionAgentId !== agentId) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid agent params: agent "${params.request.agentId}" does not match session key agent "${sessionAgentId}"`,
        ),
      );
      return;
    }
  }
  if (
    requestedSessionKey &&
    respondUnavailableAgentSessionForKey({
      sessionKey: requestedSessionKey,
      requestedSessionId,
      isRawModelRun: params.isRawModelRun,
      agentId,
      respond: params.respond,
    })
  ) {
    params.clearDedupe();
    return;
  }
  if (
    dropReboundExecApprovalFollowup({
      ...params,
      requestedSessionKeyRaw,
    })
  )
    return;
  const preAcceptedReservedSessionKey =
    requestedSessionKey &&
    resolveSessionStoreKey({
      cfg: params.cfg,
      sessionKey: requestedSessionKey,
    }) === "global"
      ? "global"
      : requestedSessionKey;
  if (preAcceptedReservedSessionKey) params.reserveDedupe(preAcceptedReservedSessionKey, agentId);
  const loaded = requestedSessionKey
    ? loadSessionEntry(requestedSessionKey, {
        ...(agentId ? { agentId } : {}),
        clone: false,
      })
    : void 0;
  return {
    normalizedAttachments,
    requestedBestEffortDeliver,
    knownAgents,
    agentId,
    requestedSessionId,
    requestedToRaw,
    sessionKeyFromTo,
    requestedSessionKeyRaw,
    requestedSessionKey,
    explicitRecipientSession,
    preAcceptedReservedSessionKey,
    preAttachmentSession: loaded?.entry
      ? {
          canonicalKey: loaded.canonicalKey,
          sessionId: loaded.entry.sessionId,
        }
      : void 0,
  };
}
function resolveAgentExplicitRecipientSessionKey(cfg, agentId) {
  return resolveExplicitAgentSessionKey({
    cfg,
    agentId,
  });
}
function dropReboundExecApprovalFollowup(params) {
  if (!params.execApprovalFollowupApprovalId || !params.requestedSessionKeyRaw) return false;
  const expectedSessionId = normalizeOptionalString(
    params.request.execApprovalFollowupExpectedSessionId,
  );
  let currentSessionId;
  try {
    currentSessionId = normalizeOptionalString(
      loadSessionEntry(params.requestedSessionKeyRaw).entry?.sessionId,
    );
  } catch {
    currentSessionId = void 0;
  }
  if (
    !isExecApprovalFollowupSessionRebound({
      expectedSessionId,
      resolvedSessionId: currentSessionId,
    })
  )
    return false;
  emitDiagnosticEvent({
    type: "exec.approval.followup_suppressed",
    approvalId: params.execApprovalFollowupApprovalId,
    reason: "session_rebound",
    phase: "gateway_preflight",
  });
  params.context.logGateway.info(
    `Dropping stale exec approval followup ${params.execApprovalFollowupApprovalId}: session ${params.requestedSessionKeyRaw} rebound (expected ${expectedSessionId}, current ${currentSessionId}) before the approval resolved`,
  );
  const droppedPayload = {
    runId: params.runId,
    status: "ok",
    summary: "exec approval followup dropped: session was reset before the approval resolved",
  };
  setGatewayDedupeEntries({
    dedupe: params.context.dedupe,
    keys: params.agentDedupeKeys,
    entry: {
      ts: Date.now(),
      ok: true,
      payload: droppedPayload,
    },
  });
  params.respond(true, droppedPayload, void 0, { runId: params.runId });
  return true;
}
//#endregion
//#region src/gateway/server-methods/agent-reset-phase.ts
async function runAgentResetPhase(params) {
  const base = {
    requestedSessionKey: params.requestedSessionKey,
    resolvedSessionId: params.resolvedSessionId,
    effectiveTranscriptInputText: params.effectiveTranscriptInputText,
    message: params.message,
  };
  const resetCommandMatch = params.message.match(RESET_COMMAND_RE);
  if (!resetCommandMatch || !params.requestedSessionKey)
    return {
      ...base,
      stop: false,
      accepted: false,
    };
  if (
    params.abortForLifecycleRotation({
      sessionKey: params.requestedSessionKey,
      agentId: params.agentId,
    })
  )
    return {
      ...base,
      stop: true,
      accepted: true,
    };
  const postResetMessage = normalizeOptionalString(resetCommandMatch[2]) ?? "";
  if (!clientHasAdminScope(params.client)) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `missing scope: ${ADMIN_SCOPE}`),
    );
    return {
      ...base,
      stop: true,
      accepted: false,
    };
  }
  const resetReason =
    normalizeOptionalLowercaseString(resetCommandMatch[1]) === "new" ? "new" : "reset";
  let resetResult;
  try {
    resetResult = await runSessionResetFromAgent({
      key: params.requestedSessionKey,
      ...(params.requestedSessionKey === "global" && params.agentId
        ? { agentId: params.agentId }
        : {}),
      reason: resetReason,
      assertCurrent: () => assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration),
      onCommitted: (commit) => {
        params.setCommittedResetCompletion({
          reason: resetReason,
          sessionId: commit.sessionId,
          sessionKey: commit.key,
          agentId: params.agentId,
          followUpPending: Boolean(postResetMessage),
        });
      },
    });
  } catch (err) {
    if (
      params.abortForLifecycleRotation({
        sessionKey: params.requestedSessionKey,
        agentId: params.agentId,
      })
    )
      return {
        ...base,
        stop: true,
        accepted: true,
      };
    throw err;
  }
  if (!resetResult.ok) {
    params.respond(false, void 0, resetResult.error);
    return {
      ...base,
      stop: true,
      accepted: false,
    };
  }
  const next = {
    ...base,
    requestedSessionKey: resetResult.key,
    resolvedSessionId: resetResult.sessionId ?? params.resolvedSessionId,
  };
  params.setCommittedResetCompletion({
    reason: resetReason,
    sessionId: resetResult.sessionId,
    sessionKey: resetResult.key,
    agentId: params.agentId,
    followUpPending: Boolean(postResetMessage),
  });
  if (postResetMessage) {
    if (
      params.abortForLifecycleRotation({
        sessionKey: resetResult.key,
        agentId: params.agentId,
      })
    )
      return {
        ...next,
        stop: true,
        accepted: true,
      };
    return {
      ...next,
      stop: false,
      accepted: false,
      effectiveTranscriptInputText: postResetMessage,
      message: postResetMessage,
    };
  }
  try {
    const deliverySession =
      params.request.deliver === true
        ? loadBareSessionResetDeliverySession({
            cfg: params.cfg,
            sessionKey: resetResult.key,
            ...(params.agentId ? { agentId: params.agentId } : {}),
          })
        : void 0;
    const resetAckResult = await resolveBareSessionResetResult({
      cfg: deliverySession?.cfg ?? params.cfg,
      context: params.context,
      reason: resetReason,
      sessionId: resetResult.sessionId,
      sessionKey: resetResult.key,
      agentId: deliverySession?.agentId ?? params.agentId,
      sessionEntry: deliverySession?.entry,
      request: params.sessionKeyFromTo
        ? {
            ...params.request,
            to: void 0,
          }
        : params.request,
      runId: params.runId,
      assertCurrent: () => assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration),
    });
    const responsePayload = buildBareSessionResetResponse({
      runId: params.runId,
      result: resetAckResult,
    });
    setGatewayDedupeEntries({
      dedupe: params.context.dedupe,
      keys: params.agentDedupeKeys,
      entry: {
        ts: Date.now(),
        ok: true,
        payload: responsePayload,
      },
    });
    params.respond(true, responsePayload, void 0, { runId: params.runId });
    emitSessionsChanged(params.context, {
      sessionKey: resetResult.key,
      ...(resetResult.key === "global" && params.agentId ? { agentId: params.agentId } : {}),
      reason: resetReason,
    });
    return {
      ...next,
      stop: true,
      accepted: true,
    };
  } catch (err) {
    if (
      params.abortForLifecycleRotation({
        sessionKey: resetResult.key,
        agentId: params.agentId,
      })
    )
      return {
        ...next,
        stop: true,
        accepted: true,
      };
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
    return {
      ...next,
      stop: true,
      accepted: false,
    };
  }
}
//#endregion
//#region src/gateway/server-methods/agent-run-admission-phase.ts
async function prepareAgentRunDispatch(params) {
  const preRegistrationAbort = readGatewayDedupeEntry({
    dedupe: params.context.dedupe,
    keys: params.agentDedupeKeys,
  });
  if (
    isPreRegistrationAbortedAgentDedupeEntryForSession({
      entry: preRegistrationAbort,
      runId: params.runId,
      sessionKey: params.resolvedSessionKey,
      alternateSessionKeys: [params.preAcceptedReservedSessionKey, params.requestedSessionKey],
    })
  ) {
    params.markAgentRunAccepted(true);
    params.respond(true, preRegistrationAbort?.payload, void 0, {
      cached: true,
      runId: params.runId,
    });
    return;
  }
  if (
    params.abortForLifecycleRotation({
      sessionKey: params.resolvedSessionKey,
      agentId: params.resolvedSessionKey === "global" ? params.activeSessionAgentId : void 0,
    })
  )
    return;
  if (params.restoredCronContinuationIdentity && !params.restoredCronContinuation) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation could not be restored"),
    );
    return;
  }
  const now = Date.now();
  const timeoutMs = resolveAgentTimeoutMs({
    cfg: params.cfgForAgent ?? params.cfg,
    overrideSeconds: typeof params.request.timeout === "number" ? params.request.timeout : void 0,
  });
  const effectiveProviderOverride =
    params.restoredCronContinuation?.provider ?? params.providerOverride;
  const effectiveModelOverride = params.restoredCronContinuation?.model ?? params.modelOverride;
  const effectiveThinking = params.restoredCronContinuation
    ? params.restoredCronContinuation.thinking
    : params.request.thinking;
  const effectiveAllowModelOverride =
    params.allowModelOverride || params.restoredCronContinuation !== void 0;
  const activeModelProvider =
    effectiveProviderOverride ??
    resolveSessionModelRef(
      params.cfgForAgent ?? params.cfg,
      params.sessionEntry,
      params.activeSessionAgentId,
    ).provider;
  const lifecycleStorePath = params.resolvedSessionKey
    ? loadSessionEntry(params.resolvedSessionKey, {
        ...(params.activeSessionAgentId ? { agentId: params.activeSessionAgentId } : {}),
        clone: false,
      }).storePath
    : `agent:${params.activeSessionAgentId}`;
  try {
    await params.acquireGatewayWorkAdmission(lifecycleStorePath);
    params.assertGatewayWorkAdmissionAllowed();
    if (!params.hasGatewayAdmissionOutcome())
      params.setAdmittedRunAbort(
        registerChatAbortController({
          chatAbortControllers: params.context.chatAbortControllers,
          runId: params.runId,
          sessionId: params.getAdmittedSessionId(),
          sessionKey: params.resolvedSessionKey,
          agentId: params.admissionAgentId(),
          timeoutMs,
          now,
          expiresAtMs: resolveAgentRunExpiresAtMs({
            now,
            timeoutMs,
          }),
          ownerConnId: params.ownerConnId,
          ownerDeviceId: params.ownerDeviceId,
          providerId: activeModelProvider,
          authProviderId: resolveProviderIdForAuth(activeModelProvider, {
            config: params.cfgForAgent ?? params.cfg,
          }),
          isAbortable: () => isEmbeddedAgentRunAbortableForRunId(params.runId),
          onRemoved: () => clearEmbeddedAgentRunAbortabilityForRunId(params.runId),
          controlUiVisible: !params.suppressVisibleSessionEffects,
          kind: "agent",
          lifecycleGeneration: params.lifecycleGeneration,
        }),
      );
  } catch (err) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
    return;
  }
  if (params.respondToGatewayAdmissionOutcome()) return;
  const activeGatewayWorkAdmission = params.getGatewayWorkAdmission();
  if (!activeGatewayWorkAdmission) {
    params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "agent run admission failed"));
    return;
  }
  const activeRunAbort = params.getAdmittedRunAbort();
  if (!activeRunAbort) {
    activeGatewayWorkAdmission.release();
    params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "agent run admission failed"));
    return;
  }
  const existingRunAbort = params.context.chatAbortControllers.get(params.runId);
  if (!activeRunAbort.registered && existingRunAbort) {
    activeGatewayWorkAdmission.release();
    params.markAgentRunAccepted(existingRunAbort.kind === "agent");
    params.respond(
      true,
      {
        runId: params.runId,
        status: "in_flight",
      },
      void 0,
      {
        cached: true,
        runId: params.runId,
      },
    );
    return;
  }
  if (!activeRunAbort.registered) activeGatewayWorkAdmission.release();
  else {
    retainEmbeddedAgentRunAbortabilityForRunId(params.runId);
    if (params.pendingChatRun)
      params.context.addChatRun(params.runId, {
        ...params.pendingChatRun,
        clientRunId: params.runId,
      });
    if (params.resolvedSessionKey)
      claimAgentRunContext(
        params.runId,
        params.suppressVisibleSessionEffects
          ? {
              isControlUiVisible: false,
              lifecycleGeneration: params.lifecycleGeneration,
            }
          : {
              sessionKey: params.resolvedSessionKey,
              lifecycleGeneration: params.lifecycleGeneration,
            },
      );
  }
  const resolvedThreadId =
    params.delivery.explicitThreadId ?? params.delivery.deliveryPlan.resolvedThreadId;
  const taskTrackingMode = resolveGatewayAgentTaskTrackingMode({
    client: params.client,
    sessionKey: params.resolvedSessionKey,
    inputProvenance: params.inputProvenance,
    confirmedAcpManualSpawn: isConfirmedAcpManualSpawnTaskOwner({
      acpTurnSource: params.request.acpTurnSource,
      sessionKey: params.resolvedSessionKey,
      client: params.client,
      logGateway: params.context.logGateway,
    }),
    modelRun: params.isOneShotModelRun,
  });
  let dispatchTaskTrackingMode = taskTrackingMode === "cli" ? "cli" : "none";
  if (taskTrackingMode === "plugin_subagent" && params.resolvedSessionKey)
    try {
      await registerPluginSubagentRunFromGateway({
        cfg: params.cfg,
        runId: params.runId,
        childSessionKey: params.resolvedSessionKey,
        task: params.request.message.trim(),
        requesterOrigin: normalizeDeliveryContext({
          channel: params.delivery.resolvedChannel,
          to: params.delivery.resolvedTo,
          accountId: params.delivery.resolvedAccountId,
          threadId: resolvedThreadId,
        }),
        pluginId: normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId),
      });
    } catch (err) {
      params.context.logGateway.warn(
        `failed to register plugin subagent run ${params.runId}; falling back to cli task tracking: ${formatForLog(err)}`,
      );
      dispatchTaskTrackingMode = "cli";
    }
  const accepted = {
    runId: params.runId,
    sessionKey: params.resolvedSessionKey,
    ...(params.resolvedSessionKey === "global" ? { agentId: params.activeSessionAgentId } : {}),
    status: "accepted",
    acceptedAt: Date.now(),
  };
  params.markAgentRunAccepted(true);
  setGatewayDedupeEntries({
    dedupe: params.context.dedupe,
    keys: params.agentDedupeKeys,
    entry: {
      ts: Date.now(),
      ok: true,
      payload: {
        ...accepted,
        controlUiVisible: !params.suppressVisibleSessionEffects,
        dedupeKeys: params.agentDedupeKeys,
        ownerConnId: params.ownerConnId,
        ownerDeviceId: params.ownerDeviceId,
      },
    },
  });
  params.respond(true, accepted, void 0, { runId: params.runId });
  return {
    activeGatewayWorkAdmission,
    activeRunAbort,
    effectiveProviderOverride,
    effectiveModelOverride,
    effectiveThinking,
    effectiveAllowModelOverride,
    restoredCronContinuationLifecycleRevision: params.restoredCronContinuation?.lifecycleRevision,
    lifecycleStorePath,
    resolvedThreadId,
    dispatchTaskTrackingMode,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-run-model-selection.ts
function createAgentRunModelSelectionHandler(params) {
  return async ({ provider, model }) => {
    updateChatRunProvider(params.context.chatAbortControllers, {
      runId: params.runId,
      providerId: provider,
      authProviderId: resolveProviderIdForAuth(provider, {
        config: params.cfgForAgent ?? params.cfg,
      }),
    });
    if (!params.restoredCronContinuationLifecycleRevision || !params.resolvedSessionKey) return;
    if (
      !(await applySessionEntryReplacements({
        activeSessionKey: params.resolvedSessionKey,
        requireWriteSuccess: true,
        sessionKeys: [params.resolvedSessionKey],
        skipMaintenance: false,
        storePath: params.lifecycleStorePath,
        update: (entries) => {
          const current = entries.find(
            (entry) => entry.sessionKey === params.resolvedSessionKey,
          )?.entry;
          const marker = current?.cronRunContinuation;
          if (
            !current ||
            marker?.phase !== "continuing" ||
            marker.ownerRunId !== params.runId ||
            marker.lifecycleRevision !== params.restoredCronContinuationLifecycleRevision
          )
            return { result: false };
          const executionProvider =
            resolveCliRuntimeExecutionProvider({
              provider,
              cfg: params.cfgForAgent ?? params.cfg,
              agentId: params.activeSessionAgentId,
              modelId: model,
            }) ?? provider;
          const cronRunContinuation = { ...marker };
          if (isCliProvider(executionProvider, params.cfgForAgent ?? params.cfg))
            cronRunContinuation.cliExecutionProvider = executionProvider;
          else delete cronRunContinuation.cliExecutionProvider;
          return {
            replacements: [
              {
                sessionKey: params.resolvedSessionKey,
                entry: {
                  ...current,
                  cronRunContinuation,
                  modelProvider: provider,
                  model,
                  updatedAt: Date.now(),
                },
              },
            ],
            result: true,
          };
        },
      }))
    )
      throw new Error("cron run continuation changed before model execution");
  };
}
//#endregion
//#region src/gateway/server-methods/agent-run-execution-phase.ts
function startAgentRunExecution(params) {
  const { prepared } = params;
  let releaseGatewayRootContinuation = retainGatewayRootWorkAdmissionContinuation() ?? void 0;
  const cleanupAdmittedRun = (options) => {
    prepared.activeRunAbort.cleanup(options);
    prepared.activeGatewayWorkAdmission.release();
    releaseGatewayRootContinuation?.();
    releaseGatewayRootContinuation = void 0;
  };
  prepared.activeGatewayWorkAdmission.run(async () => {
    await yieldAfterAgentAcceptedAck();
    let dispatched = false;
    try {
      if (prepared.activeRunAbort.controller.signal.aborted) {
        const stopReason = resolveAbortedAgentStopReason(prepared.activeRunAbort.entry);
        setAbortedAgentDedupeEntries({
          dedupe: params.context.dedupe,
          keys: params.agentDedupeKeys,
          agentId: params.resolvedSessionKey === "global" ? params.activeSessionAgentId : void 0,
          runId: params.runId,
          stopReason,
        });
        params.respond(
          true,
          {
            runId: params.runId,
            status: "timeout",
            summary: "aborted",
            stopReason,
            timeoutPhase: "queue",
            providerStarted: false,
          },
          void 0,
          { runId: params.runId },
        );
        return;
      }
      if (!params.isOneShotModelRun && params.resolvedSessionKey)
        await reactivateCompletedSubagentSession({
          sessionKey: params.resolvedSessionKey,
          runId: params.runId,
          task: params.message,
        });
      if (
        !params.suppressVisibleSessionEffects &&
        params.requestedSessionKey &&
        params.resolvedSessionKey &&
        params.isNewSession
      )
        emitSessionsChanged(params.context, {
          sessionKey: params.resolvedSessionKey,
          ...(params.resolvedSessionKey === "global"
            ? { agentId: params.activeSessionAgentId }
            : {}),
          reason: "create",
        });
      if (!params.suppressVisibleSessionEffects && params.resolvedSessionKey)
        emitSessionsChanged(params.context, {
          sessionKey: params.resolvedSessionKey,
          ...(params.resolvedSessionKey === "global"
            ? { agentId: params.activeSessionAgentId }
            : {}),
          reason: "send",
        });
      let message = params.message;
      if (!params.isRawModelRun)
        message = annotateInterSessionPromptText(message, params.inputProvenance);
      const userTurnTranscriptRecorder =
        params.resolvedSessionKey &&
        params.resolvedSessionId &&
        !params.suppressVisibleSessionEffects &&
        params.images.length === 0 &&
        params.imageOrder.length === 0
          ? createUserTurnTranscriptRecorder({
              input: {
                text: params.effectiveTranscriptInputText,
                timestamp: Date.now(),
                idempotencyKey: `${params.runId}:user`,
                ...(params.inputProvenance ? { provenance: params.inputProvenance } : {}),
              },
              target: () => {
                const loaded = loadSessionEntry(params.resolvedSessionKey, {
                  ...(params.activeSessionAgentId ? { agentId: params.activeSessionAgentId } : {}),
                  clone: false,
                });
                const loadedEntry = loaded.entry;
                const loadedSessionId = loadedEntry?.sessionId?.trim();
                if (loadedSessionId && loadedSessionId !== params.resolvedSessionId) return;
                const latestEntry = loadedSessionId
                  ? loadedEntry
                  : params.sessionEntry?.sessionId?.trim() === params.resolvedSessionId
                    ? params.sessionEntry
                    : {
                        sessionId: params.resolvedSessionId,
                        updatedAt: Date.now(),
                        sessionFile: params.sessionEntry?.sessionFile,
                      };
                if (!latestEntry) return;
                return {
                  sessionId: latestEntry.sessionId,
                  sessionKey: params.resolvedSessionKey,
                  sessionEntry: latestEntry,
                  sessionStore: loaded.store,
                  storePath: loaded.storePath,
                  agentId: params.activeSessionAgentId,
                  cwd: resolveSessionRuntimeCwd({ sessionEntry: latestEntry }),
                  ...(prepared.resolvedThreadId != null
                    ? { threadId: prepared.resolvedThreadId }
                    : {}),
                  config: params.cfgForAgent ?? params.cfg,
                };
              },
              errorContext: "gateway agent user turn transcript",
              beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
              onPersistenceError: (error) => {
                params.context.logGateway.warn(
                  `gateway agent user transcript persistence failed: ${formatForLog(error)}`,
                );
              },
            })
          : void 0;
      const ingressAgentId =
        params.resolvedSessionKey === "global"
          ? params.activeSessionAgentId
          : params.agentId &&
              (!params.resolvedSessionKey ||
                resolveAgentIdFromSessionKey(params.resolvedSessionKey) === params.agentId)
            ? params.agentId
            : void 0;
      let execApprovalFollowupRuntimeHandoff =
        params.canUseInternalRuntimeHandoff && params.execApprovalFollowupApprovalId
          ? consumeExecApprovalFollowupRuntimeHandoff({
              handoffId: params.request.internalRuntimeHandoffId,
              approvalId: params.execApprovalFollowupApprovalId,
              idempotencyKey: params.idempotencyKey,
              sessionKey: params.resolvedSessionKey,
            })
          : void 0;
      if (
        !execApprovalFollowupRuntimeHandoff &&
        params.canUseInternalRuntimeHandoff &&
        params.execApprovalFollowupApprovalId &&
        params.requestedSessionKeyRaw &&
        params.requestedSessionKeyRaw !== params.resolvedSessionKey
      )
        execApprovalFollowupRuntimeHandoff = consumeExecApprovalFollowupRuntimeHandoff({
          handoffId: params.request.internalRuntimeHandoffId,
          approvalId: params.execApprovalFollowupApprovalId,
          idempotencyKey: params.idempotencyKey,
          sessionKey: params.requestedSessionKeyRaw,
        });
      const runtimePluginToolGrant =
        params.client?.internal?.agentRunTracking === "plugin_subagent" &&
        params.client.internal.pluginRuntimeOwnerId ===
          params.client.internal.runtimePluginToolGrant?.pluginId
          ? params.client.internal.runtimePluginToolGrant
          : void 0;
      dispatchAgentRunFromGateway({
        ingressOpts: {
          message,
          images: params.images,
          imageOrder: params.imageOrder,
          agentId: ingressAgentId,
          provider: prepared.effectiveProviderOverride,
          model: prepared.effectiveModelOverride,
          to: params.delivery.resolvedTo,
          sessionId: params.resolvedSessionId,
          sessionKey: params.resolvedSessionKey,
          thinking: prepared.effectiveThinking,
          deliver: params.delivery.deliver,
          deliveryTargetMode: params.delivery.deliveryTargetMode,
          channel: params.delivery.resolvedChannel,
          accountId: params.delivery.resolvedAccountId,
          threadId: prepared.resolvedThreadId,
          runContext: {
            messageChannel: params.delivery.originMessageChannel,
            accountId: params.delivery.resolvedAccountId,
            groupId: params.groupId,
            groupChannel: params.groupChannel,
            groupSpace: params.groupSpace,
            currentThreadTs:
              prepared.resolvedThreadId != null ? String(prepared.resolvedThreadId) : void 0,
          },
          ...(execApprovalFollowupRuntimeHandoff?.bashElevated
            ? { bashElevated: execApprovalFollowupRuntimeHandoff.bashElevated }
            : {}),
          groupId: params.groupId,
          groupChannel: params.groupChannel,
          groupSpace: params.groupSpace,
          spawnedBy: params.spawnedBy,
          timeout: params.request.timeout?.toString(),
          bestEffortDeliver: params.bestEffortDeliver,
          messageChannel: params.delivery.originMessageChannel,
          runId: params.runId,
          lane: params.request.lane,
          modelRun: params.request.modelRun === true,
          promptMode: params.request.promptMode,
          extraSystemPrompt: params.request.extraSystemPrompt,
          bootstrapContextMode: params.request.bootstrapContextMode,
          bootstrapContextRunKind: params.effectiveBootstrapContextRunKind,
          toolsAllow: params.restoredCronContinuation?.toolsAllow,
          runtimePluginToolGrant,
          toolsAllowIsDefault: params.restoredCronContinuation?.toolsAllowIsDefault,
          requireExplicitMessageTarget:
            params.restoredCronContinuation?.cliSessionBindingFacts?.requireExplicitMessageTarget,
          cliSessionBindingFacts: params.restoredCronContinuation?.cliSessionBindingFacts,
          acpTurnSource: params.request.acpTurnSource,
          internalEvents: params.request.internalEvents,
          inputProvenance: params.inputProvenance,
          senderIsOwner: params.restoredCronContinuation
            ? true
            : clientHasAdminScope(params.client),
          sessionEffects: params.sessionEffects,
          skipInitialSessionTouch: params.skipAgentInitialSessionTouch,
          preserveUserFacingSessionModelState:
            params.preserveUserFacingSessionModelState && !params.restoredCronContinuation,
          sourceReplyDeliveryMode: params.restoredCronContinuation
            ? params.restoredCronContinuation.cliSessionBindingFacts?.sourceReplyDeliveryMode
            : params.request.sourceReplyDeliveryMode,
          disableMessageTool: params.request.disableMessageTool,
          forceRestartSafeTools: params.request.forceRestartSafeTools,
          suppressPromptPersistence:
            params.requestedPromptPersistenceSuppression ||
            shouldSuppressAgentPromptPersistence({
              inputProvenance: params.inputProvenance,
              internalEvents: params.request.internalEvents,
            }),
          userTurnTranscriptRecorder,
          cleanupBundleMcpOnRunEnd: params.request.cleanupBundleMcpOnRunEnd,
          abortSignal: prepared.activeRunAbort.controller.signal,
          lifecycleGeneration: params.lifecycleGeneration,
          onActiveModelSelected: createAgentRunModelSelectionHandler({
            context: params.context,
            runId: params.runId,
            cfg: params.cfg,
            cfgForAgent: params.cfgForAgent,
            restoredCronContinuationLifecycleRevision:
              prepared.restoredCronContinuationLifecycleRevision,
            resolvedSessionKey: params.resolvedSessionKey,
            lifecycleStorePath: prepared.lifecycleStorePath,
            activeSessionAgentId: params.activeSessionAgentId,
          }),
          onSessionIdChanged: (sessionId) => {
            if (prepared.activeRunAbort.entry) prepared.activeRunAbort.entry.sessionId = sessionId;
          },
          workspaceDir: resolveIngressWorkspaceOverrideForSessionRun({
            spawnedBy: params.spawnedBy,
            workspaceDir: params.sessionEntry?.spawnedWorkspaceDir,
            cwd: params.sessionEntry?.spawnedCwd,
          }),
          cwd: resolveSessionRuntimeCwd({
            requestedCwd: params.request.cwd,
            sessionEntry: params.sessionEntry,
          }),
          allowGatewaySubagentBinding: true,
          allowModelOverride: prepared.effectiveAllowModelOverride,
        },
        runId: params.runId,
        dedupeKeys: params.agentDedupeKeys,
        abortController: prepared.activeRunAbort.controller,
        cleanupAbortController: cleanupAdmittedRun,
        onSettled: params.restoredCronContinuation
          ? async ({ terminalOutcome, onRecovered }) =>
              await params.releaseCronContinuationClaimWithRecovery(
                { terminalOutcome },
                onRecovered,
              )
          : void 0,
        respond: params.respond,
        context: params.context,
        taskTrackingMode: prepared.dispatchTaskTrackingMode,
      });
      dispatched = true;
    } catch (err) {
      const error = errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err));
      const payload = {
        runId: params.runId,
        status: "error",
        summary: formatForLog(err),
      };
      setGatewayDedupeEntries({
        dedupe: params.context.dedupe,
        keys: params.agentDedupeKeys,
        entry: {
          ts: Date.now(),
          ok: false,
          payload,
          error,
        },
      });
      params.respond(false, payload, error, {
        runId: params.runId,
        error: formatForLog(err),
      });
    } finally {
      if (!dispatched)
        try {
          await params.releaseCronContinuationClaimWithRecovery();
        } finally {
          cleanupAdmittedRun({ force: true });
        }
    }
  });
}
//#endregion
//#region src/gateway/server-methods/agent-session-patch.ts
function buildAgentSessionPatch(params) {
  const freshSpawnedBy = canonicalizeSpawnedByForAgent(
    params.cfg,
    params.sessionAgentId,
    params.freshEntry?.spawnedBy,
  );
  const storedGroup = normalizeTrustedGroupMetadata(params.freshEntry);
  let inheritedGroup;
  if (
    freshSpawnedBy &&
    (!storedGroup.groupId || !storedGroup.groupChannel || !storedGroup.groupSpace)
  )
    try {
      const parentEntry = loadSessionEntry(freshSpawnedBy)?.entry;
      inheritedGroup = normalizeTrustedGroupMetadata({
        groupId: parentEntry?.groupId,
        groupChannel: parentEntry?.groupChannel,
        groupSpace: parentEntry?.space,
      });
    } catch {
      inheritedGroup = void 0;
    }
  const trustedGroup = resolveTrustedGroupMetadata({
    sessionKey: params.canonicalSessionKey,
    spawnedBy: freshSpawnedBy,
    stored: storedGroup,
    inherited: inheritedGroup,
  });
  const validatedGroup = trustedGroup.groupId
    ? resolveTrustedGroupId({
        groupId: trustedGroup.groupId,
        sessionKey: params.canonicalSessionKey,
        spawnedBy: freshSpawnedBy,
      })
    : void 0;
  const trustRequestSelectors =
    Boolean(trustedGroup.groupId) &&
    requestGroupMatchesTrusted({
      requestGroupId: params.normalizedSpawned.groupId,
      trustedGroupId: trustedGroup.groupId,
    });
  const nextGroup = validatedGroup?.dropped
    ? {
        groupId: void 0,
        groupChannel: void 0,
        groupSpace: void 0,
      }
    : {
        groupId: trustedGroup.groupId,
        groupChannel:
          trustedGroup.groupChannel ??
          (trustRequestSelectors ? params.normalizedSpawned.groupChannel : void 0),
        groupSpace:
          trustedGroup.groupSpace ??
          (trustRequestSelectors ? params.normalizedSpawned.groupSpace : void 0),
      };
  const deliveryFields = normalizeSessionDeliveryFields(params.freshEntry);
  const effectiveDelivery = mergeDeliveryContext(
    deliveryFields.deliveryContext,
    params.requestDeliveryHint,
  );
  const effectiveDeliveryFields = normalizeSessionDeliveryFields({
    route: deliveryFields.route,
    deliveryContext: effectiveDelivery,
  });
  const labelValue = normalizeOptionalString(params.requestLabel) || params.freshEntry?.label;
  const channelValue = params.freshEntry?.channel ?? params.recipientChannel?.trim();
  const freshSessionRotatedSinceLoad = Boolean(
    params.initialEntry?.sessionId &&
    params.freshEntry?.sessionId &&
    params.freshEntry.sessionId !== params.initialEntry.sessionId,
  );
  const freshLifecycleTimestamps = params.freshEntry
    ? resolveSessionLifecycleTimestamps({
        entry: params.freshEntry,
        storePath: params.storePath,
        agentId: params.sessionAgentId,
      })
    : void 0;
  const freshSkipImplicitExpiry =
    params.expectedExistingSessionId !== void 0 ||
    params.hasRestoredCronContinuation ||
    params.freshEntry?.modelSelectionLocked === true ||
    (params.resetPolicy.configured !== true && hasProviderOwnedSession(params.freshEntry));
  const freshFreshness = params.freshEntry
    ? freshSkipImplicitExpiry
      ? { fresh: true }
      : evaluateSessionFreshness({
          updatedAt: params.freshEntry.updatedAt,
          ...freshLifecycleTimestamps,
          now: params.now,
          policy: params.resetPolicy,
        })
    : void 0;
  const freshRequestedSessionMatchesEntry = Boolean(
    params.requestedSessionId && params.freshEntry?.sessionId?.trim() === params.requestedSessionId,
  );
  const freshTerminalMainTranscriptNewerThanRegistry =
    params.isSystemGatewayRun || freshRequestedSessionMatchesEntry
      ? false
      : hasTerminalMainSessionTranscriptNewerThanRegistrySync({
          entry: params.freshEntry,
          sessionScope: params.cfg.session?.scope,
          sessionKey: params.canonicalSessionKey,
          agentId: params.sessionAgentId,
          mainKey: params.cfg.session?.mainKey,
          storePath: params.storePath,
        });
  const freshRecoverableTerminalSession =
    Boolean(params.freshEntry?.sessionId) &&
    params.visibleRequest &&
    isRecoverableTerminalSessionStatus(params.freshEntry?.status);
  const freshCanReuseSession =
    Boolean(params.freshEntry?.sessionId) &&
    ((freshFreshness?.fresh ?? false) || freshRecoverableTerminalSession) &&
    !params.failedSessionTranscriptMissing(params.freshEntry) &&
    !freshTerminalMainTranscriptNewerThanRegistry;
  const freshUsableRequestedSessionId =
    params.requestedSessionId && (!params.freshEntry?.sessionId || freshCanReuseSession)
      ? params.requestedSessionId
      : void 0;
  const freshSessionId =
    freshUsableRequestedSessionId ??
    (freshCanReuseSession ? params.freshEntry?.sessionId : void 0) ??
    params.fallbackSessionId;
  const freshIsNewSession =
    !params.freshEntry ||
    (!freshCanReuseSession && !freshUsableRequestedSessionId) ||
    Boolean(
      freshUsableRequestedSessionId &&
      params.freshEntry?.sessionId !== freshUsableRequestedSessionId,
    );
  const freshRotatedSessionId = Boolean(
    params.freshEntry?.sessionId && params.freshEntry.sessionId !== freshSessionId,
  );
  const patchSessionId = freshSessionRotatedSinceLoad
    ? params.freshEntry?.sessionId
    : freshSessionId;
  const shouldClearRotatedState = freshRotatedSessionId && !freshSessionRotatedSinceLoad;
  const shouldClearTerminalState =
    freshCanReuseSession &&
    freshRecoverableTerminalSession &&
    !freshSessionRotatedSinceLoad &&
    patchSessionId === params.freshEntry?.sessionId;
  const patch = {
    sessionId: patchSessionId,
    updatedAt: params.now,
    ...(freshIsNewSession && !freshSessionRotatedSinceLoad ? { sessionStartedAt: params.now } : {}),
    ...(params.touchInteraction ? { lastInteractionAt: params.now } : {}),
    ...(effectiveDeliveryFields.route ? { route: effectiveDeliveryFields.route } : {}),
    ...(effectiveDeliveryFields.deliveryContext
      ? { deliveryContext: effectiveDeliveryFields.deliveryContext }
      : {}),
    ...(effectiveDeliveryFields.lastChannel
      ? { lastChannel: effectiveDeliveryFields.lastChannel }
      : {}),
    ...(effectiveDeliveryFields.lastTo ? { lastTo: effectiveDeliveryFields.lastTo } : {}),
    ...(effectiveDeliveryFields.lastAccountId
      ? { lastAccountId: effectiveDeliveryFields.lastAccountId }
      : {}),
    ...(effectiveDeliveryFields.lastThreadId != null
      ? { lastThreadId: effectiveDeliveryFields.lastThreadId }
      : {}),
    ...(labelValue ? { label: labelValue } : {}),
    ...(freshSpawnedBy ? { spawnedBy: freshSpawnedBy } : {}),
    ...(channelValue ? { channel: channelValue } : {}),
    groupId: nextGroup.groupId,
    groupChannel: nextGroup.groupChannel,
    space: nextGroup.groupSpace,
    ...(params.freshEntry === void 0 && params.pluginOwnerId
      ? { pluginOwnerId: params.pluginOwnerId }
      : {}),
    ...(shouldClearRotatedState || shouldClearTerminalState
      ? {
          status: void 0,
          startedAt: void 0,
          endedAt: void 0,
          runtimeMs: void 0,
          abortedLastRun: void 0,
          ...(shouldClearRotatedState ? { sessionFile: void 0 } : {}),
        }
      : {}),
  };
  if (shouldClearRotatedState) clearAllCliSessions(patch);
  return {
    patch,
    spawnedBy: freshSpawnedBy,
    groupId: nextGroup.groupId,
    groupChannel: nextGroup.groupChannel,
    groupSpace: nextGroup.groupSpace,
    freshSessionRotatedSinceLoad,
    isNewSession: freshIsNewSession,
    rotatedSessionId: freshRotatedSessionId,
    usableRequestedSessionId: freshUsableRequestedSessionId,
    freshness: freshFreshness,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-session-persist.ts
async function persistAgentSessionPhase(params) {
  let patchBuild = params.initialPatchBuild;
  let sessionEntry = params.initialSessionEntry;
  let resolvedSessionId = params.initialResolvedSessionId;
  let sessionPersistedBeforeGatewayAdmission = params.initialSessionPersistedBeforeGatewayAdmission;
  let supersededSessionId = params.initialSupersededSessionId;
  let restoredCronContinuation;
  let skipAgentInitialSessionTouch = false;
  const recoveredSessionStartedAt =
    !patchBuild.isNewSession && params.entry !== void 0 && params.entry.sessionStartedAt === void 0
      ? resolveSessionLifecycleTimestamps({
          entry: params.entry,
          storePath: params.storePath,
          agentId: params.sessionAgentId,
        }).sessionStartedAt
      : void 0;
  if (params.storePath && !params.suppressVisibleSessionEffects) {
    if (
      params.abortForLifecycleRotation({
        sessionKey: params.canonicalSessionKey,
        agentId: params.agentId,
      })
    )
      return;
    let deniedBySendPolicy = false;
    let deniedSessionEntry;
    let persisted;
    let archivedDuringStoreUpdateError;
    let deletedDuringStoreUpdateError;
    let restoredCronContinuationError;
    try {
      persisted =
        (await patchSessionEntryTarget(
          {
            agentId: params.sessionAgentId,
            storePath: params.storePath,
            target: {
              canonicalKey: params.canonicalSessionKey,
              storeKeys: params.storeKeys ?? [params.canonicalSessionKey],
            },
          },
          (_currentEntry, patchContext) => {
            assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
            const freshEntry = patchContext.existingEntry;
            assertExpectedExistingSession({
              constraint: params.expectedSession,
              entry: freshEntry,
              message: `Session "${params.canonicalSessionKey}" changed before expected work could start.`,
            });
            if (params.entry && !freshEntry) {
              deletedDuringStoreUpdateError = `Session "${params.canonicalSessionKey}" was deleted while starting work. Retry.`;
              throw new Error(deletedDuringStoreUpdateError);
            }
            const archivedError = resolveSessionWorkStartError(
              params.canonicalSessionKey,
              freshEntry,
            );
            if (archivedError) {
              archivedDuringStoreUpdateError = archivedError;
              throw new Error(archivedError);
            }
            let entryForPatch = freshEntry;
            if (params.restoredCronContinuationIdentity) {
              const marker = freshEntry?.cronRunContinuation;
              const provider = normalizeOptionalString(freshEntry?.modelProvider);
              const model = normalizeOptionalString(freshEntry?.model);
              if (
                !(
                  marker?.phase === "ready" &&
                  marker.basePersisted === true &&
                  marker.lifecycleRevision ===
                    params.restoredCronContinuationIdentity.lifecycleRevision &&
                  freshEntry?.sessionId === params.restoredCronContinuationIdentity.sessionId
                ) ||
                !freshEntry ||
                !provider ||
                !model
              ) {
                restoredCronContinuationError = "cron run continuation changed before admission";
                throw new Error(restoredCronContinuationError);
              }
              if (
                !cronContinuationHasReusableRuntime({
                  cfg: params.cfg,
                  entry: freshEntry,
                  agentId: params.sessionAgentId,
                  provider,
                  model,
                })
              ) {
                restoredCronContinuationError =
                  "cron run continuation has no reusable native CLI session";
                throw new Error(restoredCronContinuationError);
              }
              restoredCronContinuation = {
                ...params.restoredCronContinuationIdentity,
                provider,
                model,
                ...(freshEntry.thinkingLevel ? { thinking: freshEntry.thinkingLevel } : {}),
                ...(marker.toolsAllow !== void 0 ? { toolsAllow: [...marker.toolsAllow] } : {}),
                ...(marker.toolsAllowIsDefault === true ? { toolsAllowIsDefault: true } : {}),
                ...(marker.cliSessionBindingFacts
                  ? { cliSessionBindingFacts: { ...marker.cliSessionBindingFacts } }
                  : {}),
              };
              entryForPatch = {
                ...freshEntry,
                cronRunContinuation: {
                  ...marker,
                  phase: "continuing",
                  ownerRunId: params.runId,
                  ownerLifecycleGeneration: params.lifecycleGeneration,
                },
              };
              params.setCronContinuationClaim({
                storePath: params.storePath,
                sessionKey: params.canonicalSessionKey,
                lifecycleRevision: marker.lifecycleRevision,
                initialEntry: structuredClone(entryForPatch),
                mediaTaskIdsBefore: getGeneratedMediaTaskIdsForSessionKey(
                  params.canonicalSessionKey,
                ),
              });
            }
            patchBuild = params.buildSessionPatch(entryForPatch);
            const effectivePatch =
              recoveredSessionStartedAt !== void 0 &&
              entryForPatch?.sessionStartedAt === void 0 &&
              entryForPatch?.sessionId === params.entry?.sessionId
                ? {
                    ...patchBuild.patch,
                    sessionStartedAt: recoveredSessionStartedAt,
                  }
                : patchBuild.patch;
            const merged = withSqliteSessionFileMarker({
              agentId: params.sessionAgentId,
              entry: mergeSessionEntry(entryForPatch, effectivePatch),
              sessionKey: params.canonicalSessionKey,
              storePath: params.storePath,
            });
            if (
              params.request.deliver === true &&
              resolveSendPolicy({
                cfg: params.cfg,
                entry: merged,
                sessionKey: params.canonicalSessionKey,
                channel: merged.channel,
                chatType: merged.chatType,
              }) === "deny"
            ) {
              deniedBySendPolicy = true;
              deniedSessionEntry = merged;
              return null;
            }
            return merged;
          },
          {
            fallbackEntry: params.entry ?? mergeSessionEntry(void 0, patchBuild.patch),
            replaceEntry: true,
            takeCacheOwnership: true,
            maintenanceConfig: params.maintenanceConfig,
          },
        )) ?? void 0;
    } catch (err) {
      if (
        params.abortForLifecycleRotation({
          sessionKey: params.canonicalSessionKey,
          agentId: params.agentId,
        })
      )
        return;
      if (archivedDuringStoreUpdateError) {
        params.respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, archivedDuringStoreUpdateError),
        );
        return;
      }
      if (deletedDuringStoreUpdateError) {
        params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
        return;
      }
      if (err instanceof ExpectedExistingSessionChangedError) {
        params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, err.message));
        return;
      }
      if (restoredCronContinuationError) {
        params.respond(
          false,
          void 0,
          errorShape(ErrorCodes.UNAVAILABLE, restoredCronContinuationError),
        );
        return;
      }
      throw err;
    }
    if (
      params.abortForLifecycleRotation({
        sessionKey: params.canonicalSessionKey,
        agentId: params.agentId,
      })
    )
      return;
    if (deniedBySendPolicy && deniedSessionEntry) {
      sessionEntry = deniedSessionEntry;
      resolvedSessionId = sessionEntry.sessionId;
    } else if (persisted) {
      sessionEntry = persisted;
      resolvedSessionId = sessionEntry.sessionId;
      sessionPersistedBeforeGatewayAdmission = true;
    }
    if (
      patchBuild.isNewSession &&
      params.entry?.sessionId &&
      resolvedSessionId !== params.entry.sessionId
    )
      supersededSessionId = params.entry.sessionId;
    const admittedSessionId = resolvedSessionId ?? params.runId;
    params.updateAdmissionState({
      resolvedSessionId,
      admittedSessionId,
      supersededSessionId,
      sessionPersistedBeforeGatewayAdmission,
    });
    try {
      params.assertGatewayWorkAdmissionAllowed();
    } catch (err) {
      params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
      return;
    }
    if (
      params.respondToGatewayAdmissionOutcome() ||
      params.abortForLifecycleRotation({
        sessionKey: params.canonicalSessionKey,
        agentId: params.agentId,
      })
    )
      return;
    skipAgentInitialSessionTouch = params.touchInteraction;
    if (deniedBySendPolicy) {
      params.respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"),
      );
      return;
    }
  }
  const isNewSession = patchBuild.isNewSession;
  const rotatedSessionId = patchBuild.rotatedSessionId;
  const usableRequestedSessionId = patchBuild.usableRequestedSessionId;
  const freshness = patchBuild.freshness;
  if (isNewSession && params.entry?.sessionId && resolvedSessionId !== params.entry.sessionId)
    supersededSessionId = params.entry.sessionId;
  if (
    !params.suppressVisibleSessionEffects &&
    isNewSession &&
    resolvedSessionId &&
    params.storePath &&
    !patchBuild.freshSessionRotatedSinceLoad
  ) {
    const previousSessionId = rotatedSessionId ? params.entry?.sessionId : void 0;
    emitAgentSendSessionLifecycleTransition({
      cfg: params.cfg,
      sessionKey: params.canonicalSessionKey,
      sessionId: resolvedSessionId,
      storePath: params.storePath,
      sessionFile: sessionEntry?.sessionFile,
      agentId: params.sessionAgentId,
      previousSessionId,
      previousSessionFile: previousSessionId ? params.entry?.sessionFile : void 0,
      previousEndReason: previousSessionId
        ? (freshness?.staleReason ??
          (usableRequestedSessionId && params.entry?.sessionId !== usableRequestedSessionId
            ? "new"
            : "unknown"))
        : void 0,
    });
  }
  if (
    params.request.deliver === true &&
    resolveSendPolicy({
      cfg: params.cfg,
      entry: sessionEntry,
      sessionKey: params.canonicalSessionKey,
      channel: sessionEntry?.channel,
      chatType: sessionEntry?.chatType,
    }) === "deny"
  ) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"),
    );
    return;
  }
  const isMainSession =
    !params.suppressVisibleSessionEffects &&
    (params.canonicalSessionKey === params.mainSessionKey ||
      params.canonicalSessionKey === "global");
  return {
    sessionEntry,
    resolvedSessionId,
    sessionPersistedBeforeGatewayAdmission,
    supersededSessionId,
    admittedSessionId: params.getAdmittedSessionId(),
    skipAgentInitialSessionTouch,
    patchBuild,
    isNewSession,
    rotatedSessionId,
    usableRequestedSessionId,
    freshness,
    spawnedBy: patchBuild.spawnedBy,
    groupId: patchBuild.groupId,
    groupChannel: patchBuild.groupChannel,
    groupSpace: patchBuild.groupSpace,
    pendingChatRun: isMainSession
      ? {
          sessionKey: params.canonicalSessionKey,
          ...(params.canonicalSessionKey === "global" ? { agentId: params.sessionAgentId } : {}),
        }
      : void 0,
    bestEffortDeliver:
      isMainSession && params.requestedBestEffortDeliver === void 0
        ? true
        : params.bestEffortDeliver,
    restoredCronContinuation,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-session-prepare.ts
function prepareAgentSession(params) {
  const { cfg, storePath, entry, canonicalKey, legacyKey, storeKeys } = loadSessionEntry(
    params.requestedSessionKey,
    {
      ...(params.agentId ? { agentId: params.agentId } : {}),
      clone: false,
    },
  );
  if (params.expectedExistingSessionId && entry?.sessionId !== params.expectedExistingSessionId) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.UNAVAILABLE,
        `Session "${canonicalKey}" changed before expected work could start.`,
      ),
    );
    return;
  }
  let effectiveBootstrapContextRunKind = params.effectiveBootstrapContextRunKind;
  let restoredCronContinuationIdentity;
  if (
    hasGeneratedMediaCompletionEvent(params.request.internalEvents) &&
    parseCronRunScopeSuffix(canonicalKey).runId !== void 0
  ) {
    if (!params.canUseCronRunContinuation) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "cron run completion handoffs are reserved for server-owned callers",
        ),
      );
      return;
    }
    const marker = entry?.cronRunContinuation;
    const continuationSessionId = normalizeOptionalString(entry?.sessionId);
    const staleClaim =
      marker?.phase === "continuing" &&
      marker.ownerLifecycleGeneration !== params.lifecycleGeneration;
    if (staleClaim || (marker?.phase === "ready" && marker.basePersisted !== true)) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          staleClaim
            ? "cron run continuation owner was lost during gateway restart"
            : "cron run continuation base session was not persisted",
        ),
      );
      return;
    }
    if (!marker || marker.phase !== "ready" || !continuationSessionId) {
      params.respond(
        false,
        void 0,
        errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation is not ready"),
      );
      return;
    }
    if (params.requestedSessionId && params.requestedSessionId !== continuationSessionId) {
      params.respond(
        false,
        void 0,
        errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation session changed"),
      );
      return;
    }
    restoredCronContinuationIdentity = {
      lifecycleRevision: marker.lifecycleRevision,
      sessionId: continuationSessionId,
    };
    effectiveBootstrapContextRunKind = "cron";
  }
  const sessionExistedBeforeAttachmentSetup =
    params.preAttachmentSession?.canonicalKey === canonicalKey
      ? params.preAttachmentSession
      : void 0;
  if (sessionExistedBeforeAttachmentSetup && !entry) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `Session "${canonicalKey}" was deleted while starting work. Retry.`,
      ),
    );
    return;
  }
  if (
    sessionExistedBeforeAttachmentSetup &&
    entry?.sessionId !== sessionExistedBeforeAttachmentSetup.sessionId
  ) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `Session "${canonicalKey}" changed while starting work. Retry.`,
      ),
    );
    return;
  }
  if (
    respondDeletedAgentSession({
      cfg,
      canonicalKey,
      entry,
      acpMetadataSessionKey: legacyKey,
      respond: params.respond,
    })
  )
    return;
  const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
  if (archivedSessionError) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
    return;
  }
  const canonicalSessionAgentId =
    canonicalKey === "global"
      ? (params.agentId ?? resolveDefaultAgentId(cfg))
      : resolveAgentIdFromSessionKey(canonicalKey);
  const now = Date.now();
  const resetPolicy = resolveSessionResetPolicy({
    sessionCfg: cfg.session,
    resetType: resolveSessionResetType({ sessionKey: canonicalKey }),
    resetOverride: resolveChannelResetConfig({
      sessionCfg: cfg.session,
      channel: entry?.lastChannel ?? entry?.channel ?? params.recipientChannel,
    }),
  });
  const lifecycleTimestamps = entry
    ? resolveSessionLifecycleTimestamps({
        entry,
        storePath,
        agentId: canonicalSessionAgentId,
      })
    : void 0;
  const skipImplicitExpiry =
    params.expectedExistingSessionId !== void 0 ||
    restoredCronContinuationIdentity !== void 0 ||
    entry?.modelSelectionLocked === true ||
    (resetPolicy.configured !== true && hasProviderOwnedSession(entry));
  const freshness = entry
    ? skipImplicitExpiry
      ? { fresh: true }
      : evaluateSessionFreshness({
          updatedAt: entry.updatedAt,
          ...lifecycleTimestamps,
          now,
          policy: resetPolicy,
        })
    : void 0;
  const visibleRequest =
    effectiveBootstrapContextRunKind !== "cron" &&
    effectiveBootstrapContextRunKind !== "heartbeat" &&
    !params.request.internalEvents?.length;
  const failedSessionTranscriptMissing = (candidateEntry) => {
    if (candidateEntry?.status !== "failed" || !candidateEntry.sessionId?.trim()) return false;
    const sqliteMarker = parseSqliteSessionFileMarker(candidateEntry.sessionFile);
    if (sqliteMarker) {
      if (sqliteMarker.sessionId !== candidateEntry.sessionId) return true;
      try {
        return (
          readTranscriptStatsSync({
            agentId: sqliteMarker.agentId,
            sessionId: sqliteMarker.sessionId,
            sessionKey: canonicalKey,
            storePath: sqliteMarker.storePath,
            sessionEntry: candidateEntry,
          }).eventCount === 0
        );
      } catch {
        return true;
      }
    }
    try {
      const options = resolveSessionFilePathOptions({
        storePath,
        agentId: canonicalSessionAgentId,
      });
      return !existsSync(resolveSessionFilePath(candidateEntry.sessionId, candidateEntry, options));
    } catch {
      return true;
    }
  };
  const mainSessionKey = resolveAgentMainSessionKey({
    cfg,
    agentId: canonicalSessionAgentId,
  });
  const isSystemGatewayRun =
    effectiveBootstrapContextRunKind === "cron" || effectiveBootstrapContextRunKind === "heartbeat";
  const requestedSessionMatchesEntry = Boolean(
    params.requestedSessionId && entry?.sessionId?.trim() === params.requestedSessionId,
  );
  const terminalMainTranscriptNewerThanRegistry = (
    isSystemGatewayRun || requestedSessionMatchesEntry
      ? void 0
      : resolveTerminalMainSessionTranscriptRegistryCheck({
          entry,
          sessionScope: cfg.session?.scope,
          sessionKey: canonicalKey,
          agentId: canonicalSessionAgentId,
          mainKey: cfg.session?.mainKey,
          storePath,
        })
  )
    ? hasTerminalMainSessionTranscriptNewerThanRegistrySync({
        entry,
        sessionScope: cfg.session?.scope,
        sessionKey: canonicalKey,
        agentId: canonicalSessionAgentId,
        mainKey: cfg.session?.mainKey,
        storePath,
      })
    : false;
  const recoverableTerminalSession =
    Boolean(entry?.sessionId) &&
    visibleRequest &&
    isRecoverableTerminalSessionStatus(entry?.status);
  const canReuseSession =
    Boolean(entry?.sessionId) &&
    ((freshness?.fresh ?? false) || recoverableTerminalSession) &&
    !failedSessionTranscriptMissing(entry) &&
    !terminalMainTranscriptNewerThanRegistry;
  const usableRequestedSessionId =
    params.requestedSessionId && (!entry?.sessionId || canReuseSession)
      ? params.requestedSessionId
      : void 0;
  const sessionId =
    usableRequestedSessionId ?? (canReuseSession ? entry?.sessionId : void 0) ?? randomUUID();
  const isNewSession =
    !entry ||
    (!canReuseSession && !usableRequestedSessionId) ||
    Boolean(usableRequestedSessionId && entry?.sessionId !== usableRequestedSessionId);
  return {
    cfg,
    storePath,
    entry,
    canonicalKey,
    storeKeys,
    maintenanceConfig: resolveMaintenanceConfigFromInput(cfg.session?.maintenance),
    canonicalSessionAgentId,
    resetPolicy,
    now,
    freshness,
    visibleRequest,
    mainSessionKey,
    isSystemGatewayRun,
    usableRequestedSessionId,
    sessionId,
    isNewSession,
    rotatedSessionId: Boolean(entry?.sessionId && entry.sessionId !== sessionId),
    touchInteraction: visibleRequest,
    sessionPersistedBeforeGatewayAdmission: entry !== void 0,
    effectiveBootstrapContextRunKind,
    restoredCronContinuationIdentity,
    failedSessionTranscriptMissing,
  };
}
//#endregion
//#region src/gateway/server-methods/agent-run-handler.ts
const agentRunHandler = async ({ params, respond, context, client, isWebchatConnect }) => {
  const preflight = prepareAgentRequestPreflight({
    params,
    respond,
    context,
    client,
  });
  if (!preflight) return;
  const {
    request,
    cfg,
    runId,
    lifecycleGeneration,
    allowModelOverride,
    canUseInternalRuntimeHandoff,
    canUseCronRunContinuation,
    expectedSession,
    expectedExistingSessionId,
    providerOverride,
    modelOverride,
    execApprovalFollowupApprovalId,
    normalizedSpawned,
    inputProvenance,
    preserveUserFacingSessionModelState,
    sessionEffects,
    suppressVisibleSessionEffects,
    requestedPromptPersistenceSuppression,
    isOneShotModelRun,
    isRawModelRun,
    agentDedupeKeys,
  } = preflight;
  const idem = runId;
  let resolvedGroupId = normalizedSpawned.groupId;
  let resolvedGroupChannel = normalizedSpawned.groupChannel;
  let resolvedGroupSpace = normalizedSpawned.groupSpace;
  let spawnedByValue;
  const ownerConnId = typeof client?.connId === "string" ? client.connId : void 0;
  const ownerDeviceId =
    typeof client?.connect?.device?.id === "string" ? client.connect.device.id : void 0;
  const dedupeLifecycle = createAgentDedupeLifecycle({
    cfg,
    request,
    runId,
    lifecycleGeneration,
    agentDedupeKeys,
    suppressVisibleSessionEffects,
    ownerConnId,
    ownerDeviceId,
    context,
    respond,
  });
  const reservePreAcceptedAgentDedupe = dedupeLifecycle.reserve;
  const clearUnacceptedAgentDedupe = dedupeLifecycle.clearUnaccepted;
  const abortForLifecycleRotation = dedupeLifecycle.abortForLifecycleRotation;
  const routing = await prepareAgentRequestRouting({
    request,
    cfg,
    expectedSession,
    isRawModelRun,
    execApprovalFollowupApprovalId,
    runId,
    agentDedupeKeys,
    context,
    respond,
    reserveDedupe: reservePreAcceptedAgentDedupe,
    clearDedupe: clearUnacceptedAgentDedupe,
  });
  if (!routing) return;
  const {
    normalizedAttachments,
    requestedBestEffortDeliver,
    knownAgents,
    requestedSessionId,
    requestedToRaw,
    sessionKeyFromTo,
    requestedSessionKeyRaw,
    explicitRecipientSession,
    preAcceptedReservedSessionKey,
    preAttachmentSession,
  } = routing;
  let agentId = routing.agentId;
  let requestedSessionKey = routing.requestedSessionKey;
  let gatewayAdmissionTransferred = false;
  let releaseGatewayAdmission = () => {};
  const cronContinuation = createCronContinuationController({
    runId,
    lifecycleGeneration,
    context,
  });
  const releaseCronContinuationClaimWithRecovery = cronContinuation.releaseWithRecovery;
  try {
    const content = await prepareAgentContentPhase({
      request,
      cfg,
      context,
      respond,
      isRawModelRun,
      inputProvenance,
      normalizedAttachments,
      requestedSessionKeyRaw,
      requestedSessionKey,
      requestedSessionId,
      requestedToRaw,
      sessionKeyFromTo,
      agentId,
      providerOverride,
      modelOverride,
      explicitRecipientSession,
      knownAgents,
    });
    if (!content) return;
    agentId = content.agentId;
    requestedSessionKey = content.requestedSessionKey;
    let effectiveTranscriptInputText = content.effectiveTranscriptInputText;
    let message = content.message;
    const {
      images,
      imageOrder,
      replyTo,
      recipientChannel,
      recipientAccountId,
      recipientThreadId,
      to,
    } = content;
    let resolvedSessionId = requestedSessionId;
    let sessionEntry;
    let effectiveBootstrapContextRunKind = request.bootstrapContextRunKind;
    let restoredCronContinuation;
    let restoredCronContinuationIdentity;
    let sessionPersistedBeforeGatewayAdmission = false;
    let bestEffortDeliver = requestedBestEffortDeliver ?? false;
    let cfgForAgent;
    let resolvedSessionKey = requestedSessionKey;
    let resolvedSessionAgentId;
    let isNewSession = false;
    let supersededSessionId;
    let skipAgentInitialSessionTouch = false;
    let pendingChatRun;
    let admittedSessionId = resolvedSessionId ?? runId;
    const admissionController = createAgentAdmissionController({
      cfg,
      runId,
      lifecycleGeneration,
      agentDedupeKeys,
      preAcceptedReservedSessionKey,
      expectedSession,
      context,
      respond,
      dedupeLifecycle,
      getRequestedSessionKey: () => requestedSessionKey,
      getResolvedSessionKey: () => resolvedSessionKey,
      getResolvedSessionId: () => resolvedSessionId,
      getResolvedSessionAgentId: () => resolvedSessionAgentId,
      getAgentId: () => agentId,
      getCfgForAgent: () => cfgForAgent,
      getSessionPersisted: () => sessionPersistedBeforeGatewayAdmission,
      getSupersededSessionId: () => supersededSessionId,
      setAdmittedSessionId: (sessionId) => {
        admittedSessionId = sessionId;
      },
    });
    const admissionAgentId = admissionController.admissionAgentId;
    const assertGatewayWorkAdmissionAllowed = admissionController.assertAllowed;
    const acquireGatewayWorkAdmission = admissionController.acquire;
    const respondToGatewayAdmissionOutcome = admissionController.respondToOutcome;
    releaseGatewayAdmission = admissionController.release;
    const resetPhase = await runAgentResetPhase({
      request,
      cfg,
      requestedSessionKey,
      resolvedSessionId,
      effectiveTranscriptInputText,
      message,
      agentId,
      sessionKeyFromTo,
      lifecycleGeneration,
      runId,
      agentDedupeKeys,
      client,
      context,
      respond,
      abortForLifecycleRotation,
      setCommittedResetCompletion: dedupeLifecycle.setCommittedResetCompletion,
    });
    requestedSessionKey = resetPhase.requestedSessionKey;
    resolvedSessionId = resetPhase.resolvedSessionId;
    effectiveTranscriptInputText = resetPhase.effectiveTranscriptInputText;
    message = resetPhase.message;
    if (resetPhase.accepted) dedupeLifecycle.markAccepted(true);
    if (resetPhase.stop) return;
    if (requestedSessionKey) {
      const preparedSession = prepareAgentSession({
        requestedSessionKey,
        requestedSessionId,
        expectedExistingSessionId,
        agentId,
        recipientChannel,
        request,
        canUseCronRunContinuation,
        lifecycleGeneration,
        effectiveBootstrapContextRunKind,
        preAttachmentSession,
        respond,
      });
      if (!preparedSession) return;
      const {
        cfg: cfgLocal,
        storePath,
        entry,
        canonicalKey,
        storeKeys,
        maintenanceConfig: sessionMaintenanceConfig,
        canonicalSessionAgentId,
        resetPolicy,
        now,
        visibleRequest,
        mainSessionKey: mainSessionKeyForRequest,
        isSystemGatewayRun,
        sessionId,
        touchInteraction,
        failedSessionTranscriptMissing: resolveFailedSessionTranscriptMissingForEntry,
      } = preparedSession;
      cfgForAgent = cfgLocal;
      effectiveBootstrapContextRunKind = preparedSession.effectiveBootstrapContextRunKind;
      restoredCronContinuationIdentity = preparedSession.restoredCronContinuationIdentity;
      sessionPersistedBeforeGatewayAdmission =
        preparedSession.sessionPersistedBeforeGatewayAdmission;
      isNewSession = preparedSession.isNewSession;
      const sessionAgent = canonicalSessionAgentId;
      const requestDeliveryHint = normalizeDeliveryContext({
        channel: recipientChannel?.trim(),
        to,
        accountId: recipientAccountId?.trim(),
        threadId: recipientThreadId,
      });
      const buildSessionPatch = (freshEntry) =>
        buildAgentSessionPatch({
          freshEntry,
          initialEntry: entry,
          cfg: cfgLocal,
          sessionAgentId: sessionAgent,
          canonicalSessionKey: canonicalKey,
          storePath,
          normalizedSpawned,
          requestDeliveryHint,
          requestLabel: request.label,
          recipientChannel,
          pluginOwnerId:
            freshEntry === void 0
              ? normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId)
              : void 0,
          expectedExistingSessionId,
          hasRestoredCronContinuation: restoredCronContinuationIdentity !== void 0,
          resetPolicy,
          now,
          requestedSessionId,
          isSystemGatewayRun,
          visibleRequest,
          fallbackSessionId: sessionId,
          touchInteraction,
          failedSessionTranscriptMissing: resolveFailedSessionTranscriptMissingForEntry,
        });
      const patchBuild = buildSessionPatch(entry);
      isNewSession = patchBuild.isNewSession;
      sessionEntry = mergeSessionEntry(entry, patchBuild.patch);
      resolvedSessionId = sessionEntry?.sessionId ?? sessionId;
      admittedSessionId = resolvedSessionId ?? runId;
      const canonicalSessionKey = canonicalKey;
      resolvedSessionKey = canonicalSessionKey;
      const sessionAgentId = canonicalSessionAgentId;
      resolvedSessionAgentId = sessionAgentId;
      const mainSessionKey = mainSessionKeyForRequest;
      try {
        await acquireGatewayWorkAdmission(storePath ?? `agent:${sessionAgentId}`);
      } catch (err) {
        respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
        return;
      }
      if (respondToGatewayAdmissionOutcome()) return;
      const persistedSession = await persistAgentSessionPhase({
        request,
        cfg: cfgLocal,
        storePath,
        storeKeys,
        entry,
        canonicalSessionKey,
        sessionAgentId,
        mainSessionKey,
        lifecycleGeneration,
        runId,
        agentId,
        suppressVisibleSessionEffects,
        restoredCronContinuationIdentity,
        initialPatchBuild: patchBuild,
        buildSessionPatch,
        initialSessionEntry: sessionEntry,
        initialResolvedSessionId: resolvedSessionId,
        initialSessionPersistedBeforeGatewayAdmission: sessionPersistedBeforeGatewayAdmission,
        initialSupersededSessionId: supersededSessionId,
        touchInteraction,
        requestedBestEffortDeliver,
        bestEffortDeliver,
        expectedSession,
        maintenanceConfig: sessionMaintenanceConfig,
        abortForLifecycleRotation,
        assertGatewayWorkAdmissionAllowed,
        respondToGatewayAdmissionOutcome,
        updateAdmissionState: (state) => {
          resolvedSessionId = state.resolvedSessionId;
          admittedSessionId = state.admittedSessionId;
          supersededSessionId = state.supersededSessionId;
          sessionPersistedBeforeGatewayAdmission = state.sessionPersistedBeforeGatewayAdmission;
        },
        getAdmittedSessionId: () => admittedSessionId,
        setCronContinuationClaim: cronContinuation.setClaim,
        respond,
      });
      if (!persistedSession) return;
      sessionEntry = persistedSession.sessionEntry;
      resolvedSessionId = persistedSession.resolvedSessionId;
      sessionPersistedBeforeGatewayAdmission =
        persistedSession.sessionPersistedBeforeGatewayAdmission;
      supersededSessionId = persistedSession.supersededSessionId;
      admittedSessionId = persistedSession.admittedSessionId;
      skipAgentInitialSessionTouch = persistedSession.skipAgentInitialSessionTouch;
      isNewSession = persistedSession.isNewSession;
      spawnedByValue = persistedSession.spawnedBy;
      resolvedGroupId = persistedSession.groupId;
      resolvedGroupChannel = persistedSession.groupChannel;
      resolvedGroupSpace = persistedSession.groupSpace;
      pendingChatRun = persistedSession.pendingChatRun;
      bestEffortDeliver = persistedSession.bestEffortDeliver;
      restoredCronContinuation = persistedSession.restoredCronContinuation;
    }
    const delivery = await resolveAgentDeliveryPhase({
      request,
      cfg,
      cfgForAgent,
      sessionEntry,
      resolvedSessionKey,
      resolvedSessionAgentId,
      agentId,
      replyTo,
      to,
      recipientChannel,
      recipientAccountId,
      recipientThreadId,
      bestEffortDeliver,
      runId,
      client,
      context,
      respond,
      isWebchatConnect,
    });
    if (!delivery) return;
    const { activeSessionAgentId } = delivery;
    const preparedDispatch = await prepareAgentRunDispatch({
      request,
      cfg,
      cfgForAgent,
      sessionEntry,
      resolvedSessionKey,
      requestedSessionKey,
      preAcceptedReservedSessionKey,
      activeSessionAgentId,
      delivery,
      restoredCronContinuationIdentity,
      restoredCronContinuation,
      providerOverride,
      modelOverride,
      allowModelOverride,
      lifecycleGeneration,
      getAdmittedSessionId: () => admittedSessionId,
      ownerConnId,
      ownerDeviceId,
      suppressVisibleSessionEffects,
      pendingChatRun,
      inputProvenance,
      isOneShotModelRun,
      runId,
      agentDedupeKeys,
      context,
      client,
      respond,
      abortForLifecycleRotation,
      acquireGatewayWorkAdmission,
      assertGatewayWorkAdmissionAllowed,
      hasGatewayAdmissionOutcome: admissionController.hasOutcome,
      respondToGatewayAdmissionOutcome,
      admissionAgentId,
      getGatewayWorkAdmission: admissionController.getAdmission,
      setAdmittedRunAbort: admissionController.setAdmittedRunAbort,
      getAdmittedRunAbort: admissionController.getAdmittedRunAbort,
      markAgentRunAccepted: dedupeLifecycle.markAccepted,
    });
    if (!preparedDispatch) return;
    resolvedSessionId = admittedSessionId;
    gatewayAdmissionTransferred = true;
    startAgentRunExecution({
      prepared: preparedDispatch,
      request,
      cfg,
      cfgForAgent,
      sessionEntry,
      resolvedSessionKey,
      requestedSessionKey,
      requestedSessionKeyRaw,
      resolvedSessionId,
      agentId,
      activeSessionAgentId,
      delivery,
      isNewSession,
      isRawModelRun,
      isOneShotModelRun,
      suppressVisibleSessionEffects,
      message,
      images,
      imageOrder,
      effectiveTranscriptInputText,
      inputProvenance,
      runId,
      idempotencyKey: idem,
      agentDedupeKeys,
      spawnedBy: spawnedByValue,
      groupId: resolvedGroupId,
      groupChannel: resolvedGroupChannel,
      groupSpace: resolvedGroupSpace,
      bestEffortDeliver,
      lifecycleGeneration,
      effectiveBootstrapContextRunKind,
      requestedPromptPersistenceSuppression,
      preserveUserFacingSessionModelState,
      sessionEffects,
      skipAgentInitialSessionTouch,
      restoredCronContinuation,
      canUseInternalRuntimeHandoff,
      execApprovalFollowupApprovalId,
      client,
      context,
      respond,
      releaseCronContinuationClaimWithRecovery,
    });
  } finally {
    if (!gatewayAdmissionTransferred) {
      releaseGatewayAdmission();
      await releaseCronContinuationClaimWithRecovery();
    }
    clearUnacceptedAgentDedupe();
  }
};
//#endregion
//#region src/gateway/server-methods/agent-wait.ts
const agentWaitHandler = async ({ params, respond, context }) => {
  if (!validateAgentWaitParams(params)) {
    respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `invalid agent.wait params: ${formatValidationErrors(validateAgentWaitParams.errors)}`,
      ),
    );
    return;
  }
  const runId = (params.runId ?? "").trim();
  const timeoutMs =
    typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)
      ? Math.max(0, Math.floor(params.timeoutMs))
      : 3e4;
  const activeChatEntry = context.chatAbortControllers.get(runId);
  const snapshot = await waitForAgentJob({
    runId,
    timeoutMs,
    ...(activeChatEntry !== void 0 && activeChatEntry.kind !== "agent" ? { source: "chat" } : {}),
  });
  if (!snapshot) {
    const activeRunRegistered = activeChatEntry !== void 0;
    respond(true, {
      runId,
      status: "timeout",
      timeoutPhase: activeRunRegistered ? "gateway_draining" : "queue",
      ...(activeRunRegistered ? {} : { providerStarted: false }),
    });
    return;
  }
  respond(true, {
    runId,
    status: snapshot.status,
    startedAt: snapshot.startedAt,
    endedAt: snapshot.endedAt,
    error: snapshot.error,
    stopReason: snapshot.stopReason,
    livenessState: snapshot.livenessState,
    yielded: snapshot.yielded,
    pendingError: snapshot.pendingError,
    timeoutPhase: snapshot.timeoutPhase,
    providerStarted: snapshot.providerStarted,
  });
};
//#endregion
//#region src/gateway/server-methods/agent.ts
const agentHandlers = {
  agent: agentRunHandler,
  "agent.identity.get": agentIdentityGetHandler,
  "agent.wait": agentWaitHandler,
};
//#endregion
export { agentHandlers };
