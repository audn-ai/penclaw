import crypto, { createHash, randomUUID } from "node:crypto";
import { constants, createWriteStream } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { t as createAbortError$1 } from "./abort-signal-DEbc_zqk.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { o as stripMalformedXmlArgValueSuffixFromKeys } from "./agent-tools.params-BZyOAvBo.js";
import { t as isApprovalNotFoundError } from "./approval-errors-BEB18t3G.js";
import "./openclaw-exec-env-BmbZ1aqS.js";
import {
  a as drainSession,
  c as getSession,
  d as markBackgrounded,
  f as markExited,
  i as deleteSession,
  l as listFinishedSessions,
  m as tail,
  p as setJobTtlMs,
  s as getFinishedSession,
  u as listRunningSessions,
} from "./bash-process-registry-DQZTRcsj.js";
import {
  n as describeProcessTool,
  t as describeExecTool,
} from "./bash-tools.descriptions-B9OIpG9q.js";
import {
  a as registerExecApprovalFollowupRuntimeHandoff,
  r as isExecApprovalFollowupSessionRebound,
  t as buildExecApprovalFollowupIdempotencyKey,
} from "./bash-tools.exec-approval-followup-state-BoIXP4tQ.js";
import "./utils-DtcDeqWS.js";
import {
  i as resolveRegisteredExecApprovalDecision,
  n as buildExecApprovalTurnSourceContext,
  r as registerExecApprovalRequestForHostOrThrow,
  t as buildExecApprovalRequesterContext,
} from "./bash-tools.exec-approval-request-84iFIgxU.js";
import {
  _ as renderExecUpdateText,
  a as DEFAULT_PENDING_MAX_OUTPUT,
  c as buildExecRuntimeErrorOutcome,
  d as normalizeNotifyOutput,
  g as renderExecOutputText,
  h as runExecProcess,
  i as DEFAULT_PATH,
  l as createApprovalSlug,
  m as resolveExecTarget,
  n as DEFAULT_APPROVAL_TIMEOUT_MS,
  o as applyShellPath,
  p as resolveApprovalRunningNoticeMs,
  r as DEFAULT_MAX_OUTPUT,
  s as buildApprovalPendingMessage,
} from "./bash-tools.exec-runtime-BiZhPykN.js";
import { r as processSchema, t as execSchema } from "./bash-tools.schemas-DTbbXMLb.js";
import "./path-guards-CBe_wA_B.js";
import {
  a as coerceEnv,
  c as readEnvInt,
  i as clampWithDefault,
  l as sliceLogLines,
  n as buildSandboxEnv,
  o as deriveSessionName,
  s as pad,
  u as truncateMiddle,
} from "./bash-tools.shared-BjYufFPv.js";
import { t as resolveExternalBestEffortDeliveryTarget } from "./best-effort-delivery-uosomAyH.js";
import { h as stringifyRouteThreadId } from "./channel-route-u-lrE52s.js";
import {
  n as recordCommandPoll,
  r as resetCommandPollCount,
} from "./command-poll-backoff-Bl8MZxpL.js";
import { o as failedTextResult } from "./common-DyDSUect.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import {
  c as emitTrustedSecurityEvent,
  n as emitDiagnosticEvent,
} from "./diagnostic-events-5-gsFhkM.js";
import { n as getDiagnosticSessionState } from "./diagnostic-session-state-Gz0nXz2K.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { c as buildExecApprovalUnavailableReplyPayload } from "./exec-approval-reply-Djiq6tOJ.js";
import { a as resolveExecApprovalInitiatingSurfaceState } from "./exec-approval-surface-B6pFXhj3.js";
import { i as evaluateShellAllowlistWithAuthorization } from "./exec-approvals-allowlist-Bc6wvPEu.js";
import { t as buildEnforcedShellCommand } from "./exec-approvals-analysis-C-pXO6pp.js";
import {
  B as resolveDurableExecApprovalRequirement,
  I as requireValidExecTarget,
  K as resolveExecApprovalsFromFile,
  L as requiresExecApproval,
  Q as resolveExecModePolicy,
  R as resolveAllowAlwaysPatternCoverage,
  S as minSecurity,
  T as normalizeExecAsk,
  U as resolveExecApprovalUnavailableDecisions,
  V as resolveExecApprovalAllowedDecisions,
  X as resolveExecApprovalsTranscriptPath,
  b as maxAsk,
  c as commandRequiresSecurityAuditSuppressionApproval,
  h as hasNodeCommandAllowAlwaysMarker,
  l as commitExecAuthorizationLocked,
  m as hasExactCommandDurableExecApproval,
  p as hasDurableExecApproval,
  q as resolveExecApprovalsLocked,
  u as createExecApprovalPolicySnapshot,
  v as loadExecApprovals,
  z as resolveAllowAlwaysPersistenceDecision,
} from "./exec-approvals-Bz218bS2.js";
import { t as buildAuthorizedShellCommandFromPlan } from "./exec-authorization-render-D-Y4c_uA.js";
import {
  n as defaultExecAutoReviewer,
  t as createModelExecAutoReviewer,
} from "./exec-auto-reviewer-DrRp69Qz.js";
import {
  a as resolveApprovalAuditTrustPath,
  d as resolveExecutionTargetTrustPath,
} from "./exec-command-resolution-CApTmCLK.js";
import { n as rejectUnsafeExecControlShellCommand } from "./exec-control-command-guard-B6-xuqon.js";
import "./message-channel-NQc9DJ6B.js";
import { r as resolveExecSafeBinRuntimePolicy } from "./exec-safe-bin-runtime-policy-N0nkVI45.js";
import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import { t as callGatewayTool } from "./gateway-Dyh1k_4Q.js";
import {
  f as runWithGatewayIndependentRootWorkAdmission,
  t as GatewayDrainingError,
} from "./gateway-work-admission-yGjmBAjy.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import {
  c as sanitizeHostExecEnvWithDiagnostics,
  n as isDangerousHostEnvOverrideVarName,
  o as normalizeHostOverrideEnvVarKey,
  r as isDangerousHostEnvVarName,
} from "./host-env-security-pMY6K0Qy.js";
import { r as normalizeChatChannelId } from "./ids-lBaN9yr4.js";
import { t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { a as logWarn, r as logInfo } from "./logger-BegyOJlO.js";
import { i as isNativeApprovalChannel } from "./message-channel-constants-CvbXi0yz.js";
import {
  i as normalizeMessageChannel,
  n as isGatewayMessageChannel,
} from "./message-channel-normalize-Be6uJOzO.js";
import { t as sendMessage } from "./message-CmW4rY5a.js";
import { i as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-CLhkTx8I.js";
import { C as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CJQ8TR--.js";
import { n as APPROVALS_SCOPE, o as WRITE_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { p as safeStatSync } from "./path-DILYn_gk.js";
import { i as normalizePathPrepend, t as applyPathPrepend } from "./path-prepend-CSea97Kz.js";
import "./delivery-context-DXOSD_HH.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { n as detectPolicyInlineEval } from "./policy-BIrebRn7.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { c as describeInterpreterInlineEval } from "./risks-Bhlho1S0.js";
import { t as safeJsonStringify } from "./safe-json-CY5cd4H1.js";
import { n as assertSandboxPath } from "./sandbox-paths-DxDLkOQF.js";
import {
  C as formatExecDeniedUserMessage,
  T as parseExecApprovalResultText,
  d as sanitizeUserFacingText,
  w as isExecDeniedResultText,
} from "./sanitize-user-facing-text-B_JqK9fo.js";
import { S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import {
  a as isSubagentSessionKey,
  c as parseAgentSessionKey,
  i as isCronSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  a as resolveShellEnvFallbackTimeoutMs,
  r as getShellPathFromLoginShell,
} from "./shell-env-DTBGUs4j.js";
import { N as splitShellArgs } from "./shell-wrapper-resolution-DlXABXcG.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as getProcessSupervisor } from "./supervisor-BdR4bacv.js";
import { t as parsePreparedSystemRunPayload } from "./system-run-approval-context-BHTEXCwP.js";
import {
  r as resolveSystemRunCommandRequest,
  t as extractShellCommandFromArgv,
} from "./system-run-command-rsR6f6wc.js";
import { r as addSafeTimeoutDelayGraceMs } from "./timeouts-Dewo7BbT.js";
import {
  l as EXEC_TOOL_DISPLAY_SUMMARY,
  u as PROCESS_TOOL_DISPLAY_SUMMARY,
} from "./tool-catalog-fgOwzAUV.js";
import { n as textResult } from "./tool-results-BCM3fdVS.js";
//#region src/agents/bash-tools.exec-host-gateway.incident-deny.ts
const AUDIT_LOG_PATH = "/var/log/penclaw-gateway-exec.log";
const CMD_PREVIEW_BYTES = 200;
const CMD_HASH_PREFIX_HEX = 16;
const DENY_PATTERNS = [
  /(^|[\s|;&`(])sudo(\s|$)/i,
  /(^|[\s|;&`(])su(\s|$)/i,
  /(^|[\s|;&`(])doas(\s|$)/i,
  /(^|[\s|;&`(])pkexec(\s|$)/i,
  /\b(?:sudo|su|doas|pkexec)\[/i,
  /\bs[?*]+do\b/i,
  /\b(?:sudo|su|doas|pkexec|chmod|chattr)\*/i,
  /\/usr\/bin\/(?:sudo|su|doas|pkexec)/i,
  /\balias\s+\w+\s*=\s*['"]?(?:sudo|su|doas|pkexec)\b/i,
  /\b(?:env|exec|command|builtin)\s+(?:sudo|su|doas|pkexec)\b/i,
  /\b\w+\s*=\s*['"]?(?:sudo|su|doas|pkexec)['"]?/i,
  /\b(?:cp|mv|ln|install)\s+[^|;&]*\b(?:sudo|su|doas|pkexec)\b/i,
  /\beval\b/i,
  /\bbase64\s+(?:-d|--decode)\b[^;|&]*\|/i,
  /\bxxd\s+-r\b[^;|&]*\|/i,
  /\bprintf\s+["'][^"']*\\x[0-9a-f]/i,
  /\$\(\s*echo\s+[^)]*\|\s*(?:base64|xxd|tr)\b/i,
  /(^|[\s|;&`(])(chmod|setcap|chattr|setfacl|setfattr)(\s|$)/i,
  /(^|[\s|;&`(])(nsenter|unshare|capsh|setpriv)(\s|$)/i,
  /(>|>>)\s*\/?(root|etc\/sudoers|etc\/ssh|etc\/passwd|etc\/shadow|etc\/pam\.d|etc\/security|etc\/cron|etc\/systemd|var\/spool\/cron)/i,
  /(>|>>)\s*\/?home\/[^/\s]+\/\.(ssh|aws|kube|docker|gnupg)/i,
  /(>|>>)\s*\/?home\/[^/\s]+\/\.bash(rc|_profile|_logout|_history)/i,
  /(>|>>)\s*\/?home\/[^/\s]+\/\.config\/(systemd|cron)/i,
  /\btee\b[^|;&]*\/(root|etc\/sudoers|etc\/ssh|etc\/passwd|etc\/shadow|etc\/cron|home\/[^/\s]+\/\.ssh|home\/[^/\s]+\/\.aws)/i,
  /\bdd\b[^|;&]*of=\/(root|etc|home\/[^/\s]+\/\.ssh)/i,
  /\bauthorized_keys\b/i,
  /\bssh-keygen\b/i,
  /(^|[\s|;&`(])install\s.*\s\/(root|etc|home\/[^/\s]+\/\.ssh)/i,
  /(^|[\s|;&`(])(systemctl|service|update-rc\.d)(\s|$)/i,
  /(^|[\s|;&`(])(mount|umount|losetup|modprobe|insmod|rmmod|sysctl)(\s|$)/i,
  /\/etc\/(shadow|gshadow|sudoers)(\b|$)/i,
  /\bAUTH0_SECRET\b/i,
  /\bSUPABASE_SERVICE_ROLE_KEY\b/i,
  /\/home\/ubuntu\/penclaw-platform\/\.env\b/i,
  /(\.\.\/){2,}\.env\b/i,
  /\/home\/ubuntu\/\.aws\b/i,
  /\/home\/ubuntu\/\.ssh\b/i,
  /\/home\/ubuntu\/\.kube\b/i,
  /\/home\/ubuntu\/\.docker\b/i,
  /\/home\/ubuntu\/\.gnupg\b/i,
  /\/home\/ubuntu\/\.bash_history\b/i,
  /\/home\/ubuntu\/\.claude(backup)?\b/i,
  /\/home\/ubuntu\/penclaw-platform\/instances\/[^/\s]+\/(\.env|\.aws|\.ssh|openclaw\.json|console-openclaw\/openclaw\.json)\b/i,
  /\bSTRIPE_SECRET_KEY\b/i,
  /\bGITHUB_TOKEN\b/i,
  /\bOPENAI_API_KEY\b/i,
  /\bANTHROPIC_API_KEY\b/i,
];
var IncidentDenyError = class extends Error {
  constructor(matchedPattern) {
    super("exec denied: command pattern not allowed on host gateway");
    this.incident = "INCIDENT-2026-05-02-P3";
    this.name = "IncidentDenyError";
    this.matchedPattern = matchedPattern;
  }
};
function denyHostGatewayDangerous(command) {
  if (typeof command !== "string" || command.length === 0) return;
  const normalized = command.toLowerCase().replace(/\s+/g, " ");
  for (const re of DENY_PATTERNS)
    if (re.test(command) || re.test(normalized)) throw new IncidentDenyError(String(re));
}
const auditWriter = (() => {
  let stream = null;
  try {
    stream = createWriteStream(AUDIT_LOG_PATH, {
      flags: "a",
      mode: 416,
    });
    stream.on("error", () => {
      stream = null;
    });
  } catch {}
  const sha256 = (s) => {
    try {
      return createHash("sha256").update(s).digest("hex").slice(0, CMD_HASH_PREFIX_HEX);
    } catch {
      return "?";
    }
  };
  return (entry) => {
    try {
      const { cmd, ...rest } = entry;
      const record = {
        ts: /* @__PURE__ */ new Date().toISOString(),
        ...rest,
        cmdHash: cmd ? sha256(cmd) : null,
        cmdPreview: cmd ? String(cmd).slice(0, CMD_PREVIEW_BYTES) : null,
      };
      const line = `${JSON.stringify(record)}\n`;
      if (stream) stream.write(line);
      else process.stderr.write(`[exec-audit] ${line}`);
    } catch {}
  };
})();
function auditHostGatewayExec(entry) {
  auditWriter(entry);
}
//#endregion
//#region src/agents/bash-tools.exec-approval-followup.ts
/**
 * Delivery orchestration for async exec approval follow-ups.
 * Resumes the originating agent session when possible and falls back to safe
 * direct delivery only when session resume is unavailable.
 */
const log = createSubsystemLogger("agents/exec-approval-followup");
function buildExecDeniedFollowupPrompt(resultText) {
  return [
    "An async command did not run.",
    "Do not run the command again.",
    "There is no new command output.",
    "Do not mention, summarize, or reuse output from any earlier run in this session.",
    "",
    "Exact completion details:",
    resultText.trim(),
    "",
    "Reply to the user in a helpful way.",
    "Explain that the command did not run and why.",
    "Do not claim there is new command output.",
  ].join("\n");
}
function formatUnknownError(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "unknown error";
  }
}
/** Builds the prompt used to resume an agent after an approved async exec completes. */
function buildExecApprovalFollowupPrompt(resultText) {
  const trimmed = resultText.trim();
  if (isExecDeniedResultText(trimmed)) return buildExecDeniedFollowupPrompt(trimmed);
  return [
    "An async command the user already approved has completed.",
    "Do not run the command again.",
    "If the task requires more steps, continue from this result before replying to the user.",
    "Only ask the user for help if you are actually blocked.",
    "",
    "Exact completion details:",
    trimmed,
    "",
    "Continue the task if needed, then reply to the user in a helpful way.",
    "If it succeeded, share the relevant output.",
    "If it failed, explain what went wrong.",
  ].join("\n");
}
function shouldSuppressExecDeniedFollowup(sessionKey) {
  return isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey);
}
/**
 * Direct/denied followups bypass the gateway agent dispatch, so the gateway
 * rebind guard never sees them. Resolve the session key's current sessionId and
 * report whether it was rebound away from the approval-time session by `/new`
 * or `/reset` (#59349). Failure to resolve is treated as "not rebound" so a
 * real result is never suppressed by accident.
 */
function isExecApprovalFollowupDirectDeliveryStale(params) {
  const sessionKey = normalizeOptionalString(params.sessionKey);
  const expectedSessionId = normalizeOptionalString(params.expectedSessionId);
  if (!sessionKey || !expectedSessionId) return false;
  try {
    return isExecApprovalFollowupSessionRebound({
      expectedSessionId,
      resolvedSessionId: normalizeOptionalString(
        loadSessionEntry({
          storePath: resolveStorePath(normalizeOptionalString(params.sessionStore), {
            agentId: resolveAgentIdFromSessionKey(sessionKey),
          }),
          sessionKey,
          clone: false,
        })?.sessionId,
      ),
    });
  } catch (err) {
    log.debug(
      `exec approval followup session-rebind check skipped for ${sessionKey}; delivering: ${formatUnknownError(err)}`,
    );
    return false;
  }
}
function formatDirectExecApprovalFollowupText(resultText, opts = {}) {
  const parsed = parseExecApprovalResultText(resultText);
  if (parsed.kind === "other" && !parsed.raw) return null;
  if (parsed.kind === "denied")
    return opts.allowDenied ? formatExecDeniedUserMessage(parsed.raw) : null;
  if (parsed.kind === "finished") {
    const metadata = normalizeLowercaseStringOrEmpty(parsed.metadata);
    const body = sanitizeUserFacingText(parsed.body, {
      errorContext: !metadata.includes("code 0"),
    }).trim();
    let prefix = "";
    if (!body)
      prefix = metadata.includes("code 0")
        ? "Background command finished."
        : metadata.includes("signal")
          ? "Background command stopped unexpectedly."
          : "Background command finished with an error.";
    return body ? `${prefix ? `${prefix}\n\n` : ""}${body}` : prefix || null;
  }
  if (parsed.kind === "completed")
    return (
      sanitizeUserFacingText(parsed.body, { errorContext: true }).trim() ||
      "Background command finished."
    );
  return sanitizeUserFacingText(parsed.raw, { errorContext: true }).trim() || null;
}
function buildSessionResumeFallbackPrefix() {
  return "Automatic session resume failed, so sending the status directly.\n\n";
}
function readGatewayStatus(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? normalizeOptionalString(value.status)
    : void 0;
}
function readGatewayRunId(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? normalizeOptionalString(value.runId)
    : void 0;
}
function buildFollowupWaitError(params) {
  const suffix =
    typeof params.error === "string" && params.error.trim()
      ? `: ${params.error.trim()}`
      : params.status
        ? `: ${params.status}`
        : "";
  return /* @__PURE__ */ new Error(`exec approval followup session resume failed${suffix}`);
}
function isSuccessfulFollowupStatus(status) {
  return status === "ok";
}
async function waitForAgentFollowupRun(params) {
  const wait = await callGatewayTool(
    "agent.wait",
    { timeoutMs: params.timeoutMs + 2e3 },
    {
      runId: params.runId,
      timeoutMs: params.timeoutMs,
    },
  );
  const status = readGatewayStatus(wait);
  if (isSuccessfulFollowupStatus(status)) return;
  throw buildFollowupWaitError({
    status,
    error: wait.error,
  });
}
function shouldPrefixDirectFollowupWithSessionResumeFailure(params) {
  if (!params.sessionError) return false;
  const parsed = parseExecApprovalResultText(params.resultText);
  if (parsed.kind !== "finished") return true;
  return !normalizeLowercaseStringOrEmpty(parsed.metadata).includes("code 0");
}
function canDirectSendDeniedFollowup(sessionError) {
  return sessionError !== null;
}
function buildAgentFollowupArgs(params) {
  const { deliveryTarget, sessionOnlyOriginChannel } = params;
  const fallbackChannel = sessionOnlyOriginChannel ?? params.turnSourceChannel;
  return {
    sessionKey: params.sessionKey,
    message: buildExecApprovalFollowupPrompt(params.resultText),
    deliver: deliveryTarget.deliver,
    ...(deliveryTarget.deliver ? { bestEffortDeliver: true } : {}),
    channel: deliveryTarget.deliver ? deliveryTarget.channel : fallbackChannel,
    to: deliveryTarget.deliver ? deliveryTarget.to : params.turnSourceTo,
    accountId: deliveryTarget.deliver ? deliveryTarget.accountId : params.turnSourceAccountId,
    threadId: deliveryTarget.deliver
      ? deliveryTarget.threadId
      : stringifyRouteThreadId(params.turnSourceThreadId),
    idempotencyKey:
      params.idempotencyKey ??
      buildExecApprovalFollowupIdempotencyKey({ approvalId: params.approvalId }),
    ...(params.expectedSessionId
      ? { execApprovalFollowupExpectedSessionId: params.expectedSessionId }
      : {}),
    ...(params.internalRuntimeHandoffId
      ? { internalRuntimeHandoffId: params.internalRuntimeHandoffId }
      : {}),
  };
}
async function sendDirectFollowupFallback(params) {
  const directText = formatDirectExecApprovalFollowupText(params.resultText, {
    allowDenied: params.allowDenied ?? canDirectSendDeniedFollowup(params.sessionError),
  });
  if (!params.deliveryTarget.deliver || !directText) return false;
  const prefix =
    !params.allowDenied && shouldPrefixDirectFollowupWithSessionResumeFailure(params)
      ? buildSessionResumeFallbackPrefix()
      : "";
  await sendMessage({
    channel: params.deliveryTarget.channel,
    to: params.deliveryTarget.to ?? "",
    accountId: params.deliveryTarget.accountId,
    threadId: params.deliveryTarget.threadId,
    content: `${prefix}${directText}`,
    agentId: void 0,
    idempotencyKey: `exec-approval-followup:${params.approvalId}`,
  });
  return true;
}
/** Sends an exec approval follow-up via session resume or safe direct delivery. */
async function sendExecApprovalFollowup(params) {
  const sessionKey = params.sessionKey?.trim();
  const resultText = params.resultText.trim();
  if (!resultText) return false;
  const isDenied = isExecDeniedResultText(resultText);
  const deliveryTarget = resolveExternalBestEffortDeliveryTarget({
    channel: params.turnSourceChannel,
    to: params.turnSourceTo,
    accountId: params.turnSourceAccountId,
    threadId: params.turnSourceThreadId,
  });
  const normalizedTurnSourceChannel = normalizeMessageChannel(params.turnSourceChannel);
  const sessionOnlyOriginChannel =
    normalizedTurnSourceChannel && isGatewayMessageChannel(normalizedTurnSourceChannel)
      ? normalizedTurnSourceChannel
      : void 0;
  let sessionError = null;
  if (isDenied && (!sessionKey || shouldSuppressExecDeniedFollowup(sessionKey))) return false;
  if (sessionKey && params.direct !== true)
    try {
      const agentArgs = buildAgentFollowupArgs({
        approvalId: params.approvalId,
        sessionKey,
        expectedSessionId: params.expectedSessionId,
        resultText,
        deliveryTarget,
        sessionOnlyOriginChannel,
        turnSourceChannel: params.turnSourceChannel,
        turnSourceTo: params.turnSourceTo,
        turnSourceAccountId: params.turnSourceAccountId,
        turnSourceThreadId: params.turnSourceThreadId,
        internalRuntimeHandoffId: params.internalRuntimeHandoffId,
        idempotencyKey: params.idempotencyKey,
      });
      const accepted = await callGatewayTool("agent", { timeoutMs: 6e4 }, agentArgs);
      const status = readGatewayStatus(accepted);
      if (isSuccessfulFollowupStatus(status)) return true;
      if (status === "accepted" || status === "in_flight" || status === "pending") {
        const runId =
          readGatewayRunId(accepted) ?? normalizeOptionalString(agentArgs.idempotencyKey);
        if (!runId) throw buildFollowupWaitError({ status: "missing-run-id" });
        await waitForAgentFollowupRun({
          runId,
          timeoutMs: 6e4,
        });
        return true;
      }
      throw buildFollowupWaitError({
        status,
        error: accepted.error,
      });
    } catch (err) {
      sessionError = err;
    }
  if (isDenied) {
    if (
      isExecApprovalFollowupDirectDeliveryStale({
        sessionKey,
        expectedSessionId: params.expectedSessionId,
        sessionStore: params.sessionStore,
      })
    ) {
      emitDiagnosticEvent({
        type: "exec.approval.followup_suppressed",
        approvalId: params.approvalId,
        reason: "session_rebound",
        phase: "direct_delivery",
      });
      log.info(
        `Dropping stale denied exec approval followup ${params.approvalId}: session ${sessionKey ?? ""} was rebound before the approval resolved`,
      );
      return false;
    }
    if (
      await sendDirectFollowupFallback({
        approvalId: params.approvalId,
        deliveryTarget,
        resultText,
        sessionError,
        allowDenied: true,
      })
    )
      return true;
    if (sessionError)
      throw new Error(`Session followup failed: ${formatUnknownError(sessionError)}`);
    return false;
  }
  if (
    isExecApprovalFollowupDirectDeliveryStale({
      sessionKey,
      expectedSessionId: params.expectedSessionId,
      sessionStore: params.sessionStore,
    })
  ) {
    emitDiagnosticEvent({
      type: "exec.approval.followup_suppressed",
      approvalId: params.approvalId,
      reason: "session_rebound",
      phase: "direct_delivery",
    });
    log.info(
      `Dropping stale exec approval followup ${params.approvalId} direct fallback: session ${sessionKey ?? ""} was rebound before the approval resolved`,
    );
    return false;
  }
  if (
    await sendDirectFollowupFallback({
      approvalId: params.approvalId,
      deliveryTarget,
      resultText,
      sessionError,
    })
  )
    return true;
  if (sessionError) throw new Error(`Session followup failed: ${formatUnknownError(sessionError)}`);
  if (isDenied) return false;
  throw new Error("Session key or deliverable origin route is required");
}
//#endregion
//#region src/agents/bash-tools.exec-host-shared.ts
/**
 * Shared approval helpers for gateway and node exec hosts.
 * Owns pending-state construction, policy merging, unavailable-route handling,
 * follow-up dispatch, and approval-pending tool result rendering.
 */
/** Cap for deduplicating repeated follow-up dispatch failure log keys. */
const MAX_EXEC_APPROVAL_FOLLOWUP_FAILURE_LOG_KEYS = 256;
const loggedExecApprovalFollowupFailures = /* @__PURE__ */ new Set();
function rememberExecApprovalFollowupFailureKey(key) {
  if (loggedExecApprovalFollowupFailures.has(key)) return false;
  loggedExecApprovalFollowupFailures.add(key);
  if (loggedExecApprovalFollowupFailures.size > MAX_EXEC_APPROVAL_FOLLOWUP_FAILURE_LOG_KEYS) {
    const oldestKey = loggedExecApprovalFollowupFailures.values().next().value;
    if (typeof oldestKey === "string") loggedExecApprovalFollowupFailures.delete(oldestKey);
  }
  return true;
}
const EXPIRED_EXEC_APPROVAL_EXPIRES_AT_MS = 0;
function isHeadlessExecTrigger(trigger) {
  return trigger === "cron";
}
/** Builds pending approval state with warnings and a bounded expiry. */
function createExecApprovalPendingState(params) {
  const expiresAtMs =
    resolveExpiresAtMsFromDurationMs(params.timeoutMs) ?? EXPIRED_EXEC_APPROVAL_EXPIRES_AT_MS;
  return {
    warningText: params.warnings.length ? `${params.warnings.join("\n")}\n\n` : "",
    expiresAtMs,
    preResolvedDecision: void 0,
  };
}
/** Builds pending approval state plus rounded notice duration. */
function createExecApprovalRequestState(params) {
  return {
    ...createExecApprovalPendingState({
      warnings: params.warnings,
      timeoutMs: params.timeoutMs,
    }),
    noticeSeconds: Math.max(1, Math.round(params.approvalRunningNoticeMs / 1e3)),
  };
}
/** Creates a fresh approval id/slug/context key for a pending request. */
function createExecApprovalRequestContext(params) {
  const approvalId = crypto.randomUUID();
  return {
    ...createExecApprovalRequestState({
      warnings: params.warnings,
      timeoutMs: params.timeoutMs,
      approvalRunningNoticeMs: params.approvalRunningNoticeMs,
    }),
    approvalId,
    approvalSlug: params.createApprovalSlug(approvalId),
    contextKey: `exec:${approvalId}`,
  };
}
/** Creates a pending approval context using the default approval timeout. */
function createDefaultExecApprovalRequestContext(params) {
  return createExecApprovalRequestContext({
    warnings: params.warnings,
    timeoutMs: DEFAULT_APPROVAL_TIMEOUT_MS,
    approvalRunningNoticeMs: params.approvalRunningNoticeMs,
    createApprovalSlug: params.createApprovalSlug,
  });
}
/** Converts a raw approval decision plus fallback policy into execution state. */
function resolveBaseExecApprovalDecision(params) {
  if (params.decision === "deny")
    return {
      approvedByAsk: false,
      deniedReason: "user-denied",
      timedOut: false,
    };
  if (!params.decision) {
    if (params.askFallback === "full")
      return {
        approvedByAsk: true,
        deniedReason: null,
        timedOut: true,
      };
    if (params.askFallback === "deny")
      return {
        approvedByAsk: false,
        deniedReason: "approval-timeout",
        timedOut: true,
      };
    return {
      approvedByAsk: false,
      deniedReason: null,
      timedOut: true,
    };
  }
  return {
    approvedByAsk: false,
    deniedReason: null,
    timedOut: false,
  };
}
/** Resolves effective exec policy for a gateway/node host. */
async function resolveExecHostApprovalContext(params) {
  const approvals = await resolveExecApprovalsLocked(params.agentId, {
    security: params.security,
    ask: params.ask,
  });
  const hostSecurity = minSecurity(params.security, approvals.agent.security);
  const hostAsk = maxAsk(params.ask, approvals.agent.ask);
  const askFallback = minSecurity(hostSecurity, approvals.agent.askFallback);
  if (hostSecurity === "deny") throw new Error(`exec denied: host=${params.host} security=deny`);
  return {
    approvals,
    hostSecurity,
    hostAsk,
    askFallback,
  };
}
/** Waits for approval while converting wait failures to an undefined sentinel. */
async function resolveApprovalDecisionOrUndefined(params) {
  try {
    return await resolveRegisteredExecApprovalDecision({
      approvalId: params.approvalId,
      preResolvedDecision: params.preResolvedDecision,
    });
  } catch {
    params.onFailure();
    return;
  }
}
/** Resolves approval delivery availability for the initiating channel/account. */
function resolveExecApprovalUnavailableState(params) {
  const initiatingSurface = resolveExecApprovalInitiatingSurfaceState({
    channel: params.turnSourceChannel,
    accountId: params.turnSourceAccountId,
  });
  return {
    initiatingSurface,
    sentApproverDms: false,
    unavailableReason:
      params.preResolvedDecision === null
        ? "no-approval-route"
        : initiatingSurface.kind === "disabled"
          ? "initiating-platform-disabled"
          : initiatingSurface.kind === "unsupported"
            ? "initiating-platform-unsupported"
            : null,
  };
}
/** Creates, registers, and normalizes a default approval request context. */
async function createAndRegisterDefaultExecApprovalRequest(params) {
  const {
    approvalId,
    approvalSlug,
    warningText,
    expiresAtMs: defaultExpiresAtMs,
    preResolvedDecision: defaultPreResolvedDecision,
  } = createDefaultExecApprovalRequestContext({
    warnings: params.warnings,
    approvalRunningNoticeMs: params.approvalRunningNoticeMs,
    createApprovalSlug: params.createApprovalSlug,
  });
  const registration = await params.register(approvalId);
  const preResolvedDecision = registration.finalDecision;
  const { initiatingSurface, sentApproverDms, unavailableReason } =
    resolveExecApprovalUnavailableState({
      turnSourceChannel: params.turnSourceChannel,
      turnSourceAccountId: params.turnSourceAccountId,
      preResolvedDecision,
    });
  return {
    approvalId,
    approvalSlug,
    warningText,
    expiresAtMs: registration.expiresAtMs ?? defaultExpiresAtMs,
    preResolvedDecision:
      registration.finalDecision === void 0
        ? defaultPreResolvedDecision
        : registration.finalDecision,
    initiatingSurface,
    sentApproverDms,
    unavailableReason,
  };
}
/** Builds the shared argument shape passed into default approval registration. */
function buildDefaultExecApprovalRequestArgs(params) {
  return {
    warnings: params.warnings,
    approvalRunningNoticeMs: params.approvalRunningNoticeMs,
    createApprovalSlug: params.createApprovalSlug,
    turnSourceChannel: params.turnSourceChannel,
    turnSourceAccountId: params.turnSourceAccountId,
  };
}
/** Builds the immutable follow-up target passed to async approval continuations. */
function buildExecApprovalFollowupTarget(params) {
  return {
    approvalId: params.approvalId,
    sessionKey: params.sessionKey,
    expectedSessionId: params.expectedSessionId,
    sessionStore: params.sessionStore,
    turnSourceChannel: params.turnSourceChannel,
    turnSourceTo: params.turnSourceTo,
    turnSourceAccountId: params.turnSourceAccountId,
    turnSourceThreadId: params.turnSourceThreadId,
    direct: params.direct,
    bashElevated: params.bashElevated,
  };
}
/** Builds mutable approval decision state from a raw decision. */
function createExecApprovalDecisionState(params) {
  const baseDecision = resolveBaseExecApprovalDecision({
    decision: params.decision ?? null,
    askFallback: params.askFallback,
  });
  return {
    baseDecision,
    approvedByAsk: baseDecision.approvedByAsk,
    deniedReason: baseDecision.deniedReason,
  };
}
/** Prevents fallback approval from satisfying strict inline-eval/human-review paths. */
function enforceStrictInlineEvalApprovalBoundary(params) {
  const requiresRealApproval =
    params.requiresInlineEvalApproval || params.requiresAutoReviewHumanApproval === true;
  if (!params.baseDecision.timedOut || !requiresRealApproval || !params.approvedByAsk)
    return {
      approvedByAsk: params.approvedByAsk,
      deniedReason: params.deniedReason,
    };
  return {
    approvedByAsk: false,
    deniedReason: params.deniedReason ?? "approval-timeout",
  };
}
/** Returns true when a headless run should resolve an unavailable approval inline. */
function shouldResolveExecApprovalUnavailableInline(params) {
  return (
    isHeadlessExecTrigger(params.trigger) &&
    params.unavailableReason === "no-approval-route" &&
    params.preResolvedDecision === null
  );
}
/** Builds the denial copy for headless runs that cannot wait for approval. */
function buildHeadlessExecApprovalDeniedMessage(params) {
  return [
    `exec denied: ${params.trigger === "cron" ? "Cron runs" : "Headless runs"} cannot wait for interactive exec approval.`,
    `Effective host exec policy: security=${params.security} ask=${params.ask} askFallback=${params.askFallback}`,
    `Stricter values from tools.exec and ${resolveExecApprovalsTranscriptPath()} both apply.`,
    "Fix one of these:",
    '- align both files to security="full" and ask="off" for trusted local automation',
    "- keep allowlist mode and add an explicit allowlist entry for this command",
    "- enable Web UI, terminal UI, or chat exec approvals and rerun interactively",
    'Tip: run "openclaw doctor" and "openclaw approvals get --gateway" to inspect the effective policy.',
  ].join("\n");
}
/** Sends async approval follow-up results with deduped warning logs on failure. */
async function sendExecApprovalFollowupResult(target, resultText, deps = {}) {
  const send = deps.sendExecApprovalFollowup ?? sendExecApprovalFollowup;
  const warn = deps.logWarn ?? logWarn;
  const runtimeHandoff =
    target.direct === true || !target.sessionKey || isExecDeniedResultText(resultText)
      ? void 0
      : registerExecApprovalFollowupRuntimeHandoff({
          approvalId: target.approvalId,
          sessionKey: target.sessionKey,
          bashElevated: target.bashElevated,
        });
  await send({
    approvalId: target.approvalId,
    sessionKey: target.sessionKey,
    expectedSessionId: target.expectedSessionId,
    sessionStore: target.sessionStore,
    turnSourceChannel: target.turnSourceChannel,
    turnSourceTo: target.turnSourceTo,
    turnSourceAccountId: target.turnSourceAccountId,
    turnSourceThreadId: target.turnSourceThreadId,
    resultText,
    direct: target.direct,
    ...(runtimeHandoff
      ? {
          internalRuntimeHandoffId: runtimeHandoff.handoffId,
          idempotencyKey: runtimeHandoff.idempotencyKey,
        }
      : {}),
  }).catch((error) => {
    if (isApprovalNotFoundError(error)) return;
    const message = formatErrorMessage(error);
    if (!rememberExecApprovalFollowupFailureKey(`${target.approvalId}:${message}`)) return;
    warn(`exec approval followup dispatch failed (id=${target.approvalId}): ${message}`);
  });
}
/** Renders an approval-pending or approval-unavailable exec tool result. */
function buildExecApprovalPendingToolResult(params) {
  const allowedDecisions = params.allowedDecisions ?? resolveExecApprovalAllowedDecisions();
  return {
    content: [
      {
        type: "text",
        text:
          params.unavailableReason !== null
            ? (buildExecApprovalUnavailableReplyPayload({
                warningText: params.warningText,
                reason: params.unavailableReason,
                channel: params.initiatingSurface.channel,
                channelLabel: params.initiatingSurface.channelLabel,
                accountId: params.initiatingSurface.accountId,
                sentApproverDms: params.sentApproverDms,
                host: params.host,
                nodeId: params.nodeId,
              }).text ?? "")
            : buildApprovalPendingMessage({
                warningText: params.warningText,
                approvalSlug: params.approvalSlug,
                approvalId: params.approvalId,
                allowedDecisions,
                command: params.command,
                cwd: params.cwd,
                host: params.host,
                nodeId: params.nodeId,
              }),
      },
    ],
    details:
      params.unavailableReason !== null
        ? {
            status: "approval-unavailable",
            reason: params.unavailableReason,
            channel: params.initiatingSurface.channel,
            channelLabel: params.initiatingSurface.channelLabel,
            accountId: params.initiatingSurface.accountId,
            sentApproverDms: params.sentApproverDms,
            host: params.host,
            command: params.command,
            cwd: params.cwd,
            nodeId: params.nodeId,
            warningText: params.warningText,
          }
        : {
            status: "approval-pending",
            approvalId: params.approvalId,
            approvalSlug: params.approvalSlug,
            expiresAtMs: params.expiresAtMs,
            allowedDecisions,
            host: params.host,
            command: params.command,
            cwd: params.cwd,
            nodeId: params.nodeId,
            warningText: params.warningText,
          },
  };
}
//#endregion
//#region src/agents/bash-tools.exec-host-gateway.ts
/**
 * Gateway-host exec approval and allowlist handling.
 * Evaluates shell allowlists, auto-review, durable approvals, follow-up routing,
 * and approved command execution for gateway-backed exec calls.
 */
function hasGatewayAllowlistMiss(params) {
  return (
    params.hostSecurity === "allowlist" &&
    (!params.analysisOk || !params.allowlistSatisfied) &&
    !params.durableApprovalSatisfied
  );
}
function resolveGatewayAutoReviewReason(params) {
  if (params.requiresInlineEvalApproval) return "strict-inline-eval";
  if (params.requiresHeredocApproval) return "heredoc";
  if (params.requiresAllowlistPlanApproval) return "execution-plan-miss";
  if (
    hasGatewayAllowlistMiss({
      hostSecurity: params.hostSecurity,
      analysisOk: params.analysisOk,
      allowlistSatisfied: params.allowlistSatisfied,
      durableApprovalSatisfied: params.durableApprovalSatisfied,
    })
  )
    return "allowlist-miss";
  return "approval-required";
}
function createOneShotAllowAlwaysDecision() {
  return {
    kind: "one-shot",
    reasons: ["no-reusable-pattern"],
  };
}
function resolveGatewayEffectiveAllowAlwaysPersistence(params) {
  if (!params.requiresAllowlistPlanApproval) return params.allowAlwaysPersistence;
  if (params.allowAlwaysPersistence.kind !== "patterns") return params.allowAlwaysPersistence;
  return createOneShotAllowAlwaysDecision();
}
function resolveGatewayEnforcedCommand(params) {
  return process.platform === "win32"
    ? buildEnforcedShellCommand({
        command: params.command,
        segments: params.segments,
        platform: process.platform,
      })
    : params.authorizationPlan
      ? buildAuthorizedShellCommandFromPlan({
          plan: params.authorizationPlan,
          mode: "enforced",
          segmentSatisfiedBy: params.segmentSatisfiedBy,
        })
      : {
          ok: false,
          reason: "authorization plan unavailable",
        };
}
function formatOutcomeExitLabel(outcome) {
  return outcome.timedOut ? "timeout" : `code ${outcome.exitCode ?? "?"}`;
}
function formatBytes(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return `${Math.max(0, Math.round(value))} bytes`;
}
function formatDiagnosticsContents(manifest) {
  const contents = Array.isArray(manifest.contents) ? manifest.contents : [];
  if (contents.length === 0) return [];
  const lines = [`Contents (${contents.length} files):`];
  for (const entry of contents.slice(0, 12)) {
    if (!isRecord(entry)) continue;
    const path = typeof entry.path === "string" ? entry.path : "";
    if (!path) continue;
    const bytes = formatBytes(entry.bytes);
    lines.push(`- ${bytes ? `${path} (${bytes})` : path}`);
  }
  if (contents.length > 12) lines.push(`- ... ${contents.length - 12} more`);
  return lines;
}
function formatDiagnosticsPrivacy(manifest) {
  const privacy = isRecord(manifest.privacy) ? manifest.privacy : null;
  if (!privacy) return [];
  const lines = ["Privacy:"];
  if (typeof privacy.payloadFree === "boolean")
    lines.push(`- payload-free: ${privacy.payloadFree ? "yes" : "no"}`);
  if (typeof privacy.rawLogsIncluded === "boolean")
    lines.push(`- raw logs included: ${privacy.rawLogsIncluded ? "yes" : "no"}`);
  const notes = Array.isArray(privacy.notes)
    ? privacy.notes.filter((note) => typeof note === "string")
    : [];
  for (const note of notes.slice(0, 4)) lines.push(`- ${note}`);
  return lines.length > 1 ? lines : [];
}
function formatDiagnosticsExportSuccess(aggregated) {
  const trimmed = aggregated.trim();
  if (!trimmed) return "Diagnostics export completed, but no JSON output was returned.";
  try {
    const parsed = JSON.parse(trimmed);
    if (!isRecord(parsed)) return trimmed;
    const manifest = isRecord(parsed.manifest) ? parsed.manifest : {};
    const lines = ["Diagnostics export created.", "", "Local Gateway bundle:"];
    const bundlePath = typeof parsed.path === "string" ? parsed.path : "";
    if (bundlePath) lines.push(`Path: ${bundlePath}`);
    const bytes = formatBytes(parsed.bytes);
    if (bytes) lines.push(`Size: ${bytes}`);
    if (typeof manifest.generatedAt === "string")
      lines.push(`Generated at: ${manifest.generatedAt}`);
    if (typeof manifest.openclawVersion === "string")
      lines.push(`OpenClaw version: ${manifest.openclawVersion}`);
    const contents = formatDiagnosticsContents(manifest);
    if (contents.length > 0) lines.push("", ...contents);
    const privacy = formatDiagnosticsPrivacy(manifest);
    if (privacy.length > 0) lines.push("", ...privacy);
    return lines.join("\n");
  } catch {
    return trimmed;
  }
}
function emitGatewayExecApprovalSecurityEvent(params) {
  emitTrustedSecurityEvent({
    category: "approval",
    action: params.action,
    outcome: params.outcome,
    severity: params.severity,
    actor: { kind: "agent" },
    target: {
      kind: "tool",
      name: "system.exec",
      owner: params.host,
    },
    policy: {
      id: "exec.approval",
      decision:
        params.action === "exec.approval.requested"
          ? "ask"
          : params.outcome === "success"
            ? "allow"
            : "deny",
      ...(params.reason ? { reason: params.reason } : {}),
    },
    control: {
      id: "exec.approval",
      family: "approval",
    },
    ...(params.reason ? { reason: params.reason } : {}),
    attributes: {
      host: params.host,
      security: params.hostSecurity,
      ask: params.hostAsk,
      segment_count: params.segmentCount,
      has_agent_id: Boolean(params.agentId?.trim()),
      ...(params.trigger ? { trigger: params.trigger } : {}),
      ...(params.decision ? { decision: params.decision } : {}),
    },
  });
}
function formatDiagnosticsExportFailure(params) {
  const output = normalizeNotifyOutput(tail(params.outcome.aggregated || "", 4e3));
  const lines = [`Diagnostics export failed (${params.exitLabel}).`];
  if (params.outcome.reason) lines.push(params.outcome.reason);
  if (output) lines.push("", output);
  return lines.join("\n");
}
function buildGatewayExecApprovalFollowupSummary(params) {
  const exitLabel = formatOutcomeExitLabel(params.outcome);
  if (params.trigger === "diagnostics") {
    const body = [
      params.outcome.status === "completed" && params.outcome.exitCode === 0
        ? formatDiagnosticsExportSuccess(params.outcome.aggregated)
        : formatDiagnosticsExportFailure({
            outcome: params.outcome,
            exitLabel,
          }),
      params.approvalFollowupText?.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");
    return `Exec finished (gateway id=${params.approvalId}, session=${params.sessionId}, ${exitLabel})\n${body}`;
  }
  const output = normalizeNotifyOutput(tail(params.outcome.aggregated || "", 400));
  return output
    ? `Exec finished (gateway id=${params.approvalId}, session=${params.sessionId}, ${exitLabel})\n${output}`
    : `Exec finished (gateway id=${params.approvalId}, session=${params.sessionId}, ${exitLabel})`;
}
function shouldAwaitGatewayApprovalInline(params) {
  if (params.approvalFollowupMode !== void 0) return false;
  return isNativeApprovalChannel(normalizeMessageChannel(params.turnSourceChannel));
}
function buildGatewayExecApprovalDeniedToolResult(params) {
  const text = `Exec denied (gateway id=${params.approvalId}, ${params.deniedReason}): ${params.command}`;
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
    details: {
      status: "failed",
      exitCode: null,
      durationMs: 0,
      aggregated: text,
      timedOut: params.deniedReason.includes("timeout"),
      cwd: params.cwd,
    },
  };
}
async function resolveGatewayExecApprovalFollowupText(params) {
  if (!params.approvalFollowup) return;
  try {
    return await params.approvalFollowup({
      approvalId: params.approvalId,
      sessionId: params.sessionId,
      trigger: params.trigger,
      outcome: params.outcome,
    });
  } catch (error) {
    return `Diagnostics follow-up failed: ${error instanceof Error ? error.message : String(error)}`;
  }
}
/** Processes gateway exec policy and returns execution/approval/denial outcome. */
async function processGatewayAllowlist(params) {
  try {
    denyHostGatewayDangerous(params.command);
  } catch (err) {
    const reason =
      err instanceof IncidentDenyError
        ? err.matchedPattern
        : err instanceof Error
          ? err.message
          : "denied";
    auditHostGatewayExec({
      agent: params.agentId,
      sessionKey: params.sessionKey,
      security: params.security,
      ask: params.ask,
      cmd: params.command,
      allowed: false,
      reason,
    });
    throw err;
  }
  auditHostGatewayExec({
    agent: params.agentId,
    sessionKey: params.sessionKey,
    security: params.security,
    ask: params.ask,
    cmd: params.command,
    allowed: true,
    reason: "passed-deny-list",
  });
  const { approvals, hostSecurity, hostAsk, askFallback } = await resolveExecHostApprovalContext({
    agentId: params.agentId,
    security: params.security,
    ask: params.ask,
    host: "gateway",
  });
  const evaluationPolicySnapshot = createExecApprovalPolicySnapshot({
    file: approvals.file,
    agentId: params.agentId,
  });
  const fallbackSecurity = minSecurity(hostSecurity, askFallback);
  const allowlistEval = await evaluateShellAllowlistWithAuthorization({
    command: params.command,
    allowlist: approvals.allowlist,
    safeBins: params.safeBins,
    safeBinProfiles: params.safeBinProfiles,
    cwd: params.workdir,
    env: params.env,
    platform: process.platform,
    trustedSafeBinDirs: params.trustedSafeBinDirs,
  });
  const allowlistMatches = allowlistEval.allowlistMatches;
  const analysisOk = allowlistEval.analysisOk;
  const allowlistSatisfied =
    hostSecurity === "allowlist" && analysisOk ? allowlistEval.allowlistSatisfied : false;
  const durableApprovalSatisfied = hasDurableExecApproval({
    analysisOk,
    segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
    allowlist: approvals.allowlist,
    commandText: params.command,
  });
  const inlineEvalHit =
    params.strictInlineEval === true ? detectPolicyInlineEval(allowlistEval.segments) : null;
  const allowAlwaysPersistence = resolveAllowAlwaysPersistenceDecision({
    segments: allowlistEval.segments,
    cwd: params.workdir,
    env: params.env,
    platform: process.platform,
    commandText: params.command,
    strictInlineEval: params.strictInlineEval === true,
    authorizationPlan: allowlistEval.authorizationPlan,
    runtimePayload: inlineEvalHit !== null,
  });
  if (inlineEvalHit)
    params.warnings.push(
      `Warning: strict inline-eval mode requires reviewer or explicit approval for ${describeInterpreterInlineEval(inlineEvalHit)}.`,
    );
  const exactCommandDurableApprovalSatisfied = hasExactCommandDurableExecApproval({
    allowlist: approvals.allowlist,
    commandText: params.command,
  });
  const allowlistAuthorizationSatisfied = analysisOk && allowlistEval.allowlistSatisfied;
  const gatewayEnforcedCommand =
    (hostSecurity === "allowlist" || fallbackSecurity === "allowlist") && analysisOk
      ? resolveGatewayEnforcedCommand({
          command: params.command,
          segments: allowlistEval.segments,
          authorizationPlan: allowlistEval.authorizationPlan,
          segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy,
        })
      : null;
  let enforcedCommand;
  let allowlistPlanUnavailableReason = null;
  if (hostSecurity === "allowlist" && analysisOk && allowlistSatisfied) {
    const enforced = gatewayEnforcedCommand ?? {
      ok: false,
      reason: "authorization plan unavailable",
    };
    if (!enforced.ok || !enforced.command)
      allowlistPlanUnavailableReason =
        ("reason" in enforced ? enforced.reason : void 0) ?? "unsupported platform";
    else enforcedCommand = enforced.command;
  }
  const fallbackEnforcedCommand =
    fallbackSecurity === "allowlist" &&
    allowlistAuthorizationSatisfied &&
    gatewayEnforcedCommand?.ok === true
      ? gatewayEnforcedCommand.command
      : void 0;
  const fallbackAllowlistAuthorizationSatisfied =
    fallbackSecurity === "allowlist" &&
    (allowlistAuthorizationSatisfied || exactCommandDurableApprovalSatisfied);
  const fallbackAllowlistPlanSatisfied =
    exactCommandDurableApprovalSatisfied || fallbackEnforcedCommand !== void 0;
  const applyTimedOutAllowlistFallback = (state) => {
    if (!state.baseDecision.timedOut || fallbackSecurity !== "allowlist") return state;
    if (!fallbackAllowlistAuthorizationSatisfied)
      return {
        ...state,
        approvedByAsk: false,
        deniedReason: "approval-timeout: allowlist-miss",
      };
    if (!fallbackAllowlistPlanSatisfied)
      return {
        ...state,
        approvedByAsk: false,
        deniedReason: "approval-timeout: execution-plan-miss",
      };
    return {
      ...state,
      approvedByAsk: true,
      deniedReason: null,
    };
  };
  const commitExecutionAuthorization = (options) => {
    const policyAuthorization =
      options.source === "current-policy" || options.source === "ask-fallback";
    const durableApprovalRequirement = resolveDurableExecApprovalRequirement({
      durableApprovalRequired:
        options.source === "current-policy"
          ? hostSecurity === "allowlist" &&
            durableApprovalSatisfied &&
            (!analysisOk ||
              !allowlistSatisfied ||
              (exactCommandDurableApprovalSatisfied && allowlistPlanUnavailableReason !== null))
          : options.source === "ask-fallback"
            ? fallbackSecurity === "allowlist" &&
              exactCommandDurableApprovalSatisfied &&
              fallbackEnforcedCommand === void 0
            : false,
      allowlist: approvals.allowlist,
      commandText: params.command,
    });
    const delayedAuthorization =
      options.source === "explicit-approval" || options.source === "auto-review";
    return commitExecAuthorizationLocked({
      agentId: params.agentId,
      matches: allowlistMatches,
      command: params.command,
      resolvedPath: options.resolvedPath,
      authorization: {
        source: options.source,
        security: options.source === "ask-fallback" ? fallbackSecurity : hostSecurity,
        ask: hostAsk,
        allowlistSatisfied: allowlistAuthorizationSatisfied || durableApprovalSatisfied,
        ...(delayedAuthorization ? { policySnapshot: evaluationPolicySnapshot } : {}),
        requireAutoAllowSkills:
          policyAuthorization && allowlistEval.segmentSatisfiedBy.includes("skills"),
        requireExactCommandApproval:
          policyAuthorization && durableApprovalRequirement === "exact-command",
        requireDurableAllowlistApproval:
          policyAuthorization && durableApprovalRequirement === "segment-allowlist",
      },
      ...(options.allowAlwaysDecision ? { allowAlwaysDecision: options.allowAlwaysDecision } : {}),
    });
  };
  const hasHeredocSegment = allowlistEval.segments.some((segment) =>
    segment.argv.some((token) => token.startsWith("<<")),
  );
  const requiresHeredocApproval =
    hasHeredocSegment && hostSecurity === "allowlist" && analysisOk && allowlistSatisfied;
  const timedOutFallbackRequiresHeredocApproval =
    hasHeredocSegment && fallbackAllowlistAuthorizationSatisfied;
  const requiresInlineEvalApproval = inlineEvalHit !== null;
  const requiresAllowlistPlanApproval =
    hostSecurity === "allowlist" &&
    analysisOk &&
    allowlistSatisfied &&
    !exactCommandDurableApprovalSatisfied &&
    !enforcedCommand &&
    allowlistPlanUnavailableReason !== null;
  const requiresSecurityAuditSuppressionApproval =
    commandRequiresSecurityAuditSuppressionApproval({
      command: params.command,
      cwd: params.workdir,
      env: params.env,
      segments: allowlistEval.segments,
    }) && !(hostSecurity === "full" && hostAsk === "off");
  const requiresAsk =
    requiresExecApproval({
      ask: hostAsk,
      security: hostSecurity,
      analysisOk,
      allowlistSatisfied,
      durableApprovalSatisfied,
    }) ||
    requiresAllowlistPlanApproval ||
    requiresHeredocApproval ||
    requiresInlineEvalApproval ||
    requiresSecurityAuditSuppressionApproval;
  if (requiresHeredocApproval)
    params.warnings.push(
      "Warning: heredoc execution requires reviewer or explicit approval in allowlist mode.",
    );
  if (requiresAllowlistPlanApproval)
    params.warnings.push(
      `Warning: allowlist auto-execution is unavailable on ${process.platform}; reviewer or explicit approval is required.`,
    );
  const effectiveAllowAlwaysPersistence = resolveGatewayEffectiveAllowAlwaysPersistence({
    command: params.command,
    allowAlwaysPersistence,
    requiresAllowlistPlanApproval,
  });
  const approvalAllowedDecisions = resolveExecApprovalAllowedDecisions({
    ask: hostAsk,
    allowAlwaysPersistence: effectiveAllowAlwaysPersistence,
  });
  const approvalUnavailableDecisions = resolveExecApprovalUnavailableDecisions({
    ask: hostAsk,
    allowAlwaysPersistence: effectiveAllowAlwaysPersistence,
  });
  const unavailableDecisionRequestParams =
    approvalUnavailableDecisions.length > 0
      ? { unavailableDecisions: approvalUnavailableDecisions }
      : {};
  if (requiresSecurityAuditSuppressionApproval)
    params.warnings.push(
      "Warning: security audit suppression changes require explicit approval unless exec is running in yolo mode.",
    );
  if (requiresAsk) {
    const [autoReviewSegment] = allowlistEval.segments;
    const autoReviewArgv =
      allowlistEval.segments.length === 1 &&
      (autoReviewSegment?.raw === void 0 || autoReviewSegment.raw.trim() === params.command.trim())
        ? autoReviewSegment?.argv
        : void 0;
    const autoReviewHasBoundCommand = analysisOk && autoReviewArgv !== void 0;
    const autoReviewEnforcedCommand =
      gatewayEnforcedCommand?.ok === true ? gatewayEnforcedCommand.command : void 0;
    const autoReviewResolvedPath = autoReviewHasBoundCommand
      ? resolveExecutionTargetTrustPath(autoReviewSegment?.resolution ?? null, params.workdir)
      : void 0;
    const autoReviewHasExecutableBinding =
      autoReviewHasBoundCommand &&
      autoReviewEnforcedCommand !== void 0 &&
      autoReviewResolvedPath !== void 0;
    const canAutoReviewApprovalMiss =
      params.autoReview === true &&
      hostAsk !== "always" &&
      autoReviewHasExecutableBinding &&
      !requiresSecurityAuditSuppressionApproval;
    let autoReviewRequiresHumanApproval =
      (params.autoReview === true && hostAsk !== "always" && !autoReviewHasExecutableBinding) ||
      requiresAllowlistPlanApproval ||
      requiresHeredocApproval ||
      requiresSecurityAuditSuppressionApproval;
    if (canAutoReviewApprovalMiss) {
      const decision = await (params.autoReviewer ?? defaultExecAutoReviewer)({
        command: params.command,
        argv: autoReviewArgv,
        resolvedPath: autoReviewResolvedPath,
        cwd: params.workdir,
        envKeys: Object.keys(params.requestedEnv ?? {}).toSorted(),
        host: "gateway",
        reason: resolveGatewayAutoReviewReason({
          requiresInlineEvalApproval,
          requiresHeredocApproval,
          requiresAllowlistPlanApproval,
          hostSecurity,
          analysisOk,
          allowlistSatisfied,
          durableApprovalSatisfied,
        }),
        analysis: {
          parsed: analysisOk,
          allowlistMatched: allowlistSatisfied,
          durableApprovalMatched: durableApprovalSatisfied,
          inlineEval: requiresInlineEvalApproval,
          heredoc: requiresHeredocApproval,
        },
        agent: {
          id: params.agentId,
          sessionKey: params.sessionKey,
        },
      });
      params.signal?.throwIfAborted();
      if (
        decision.decision === "allow-once" &&
        decision.risk === "low" &&
        autoReviewEnforcedCommand
      ) {
        params.warnings.push(
          `Exec auto-review allowed once (risk=${decision.risk}): ${decision.rationale}`,
        );
        emitGatewayExecApprovalSecurityEvent({
          action: "exec.approval.approved",
          outcome: "success",
          severity: "medium",
          agentId: params.agentId,
          hostSecurity,
          hostAsk,
          host: "gateway",
          segmentCount: allowlistEval.segments.length,
          trigger: params.trigger,
          decision: "auto-review",
        });
        await commitExecutionAuthorization({
          source: "auto-review",
          resolvedPath: resolveApprovalAuditTrustPath(
            allowlistEval.segments[0]?.resolution ?? null,
            params.workdir,
          ),
        });
        return { execCommandOverride: autoReviewEnforcedCommand };
      }
      params.warnings.push(
        `Exec auto-review deferred to human approval (risk=${decision.risk}): ${decision.rationale}`,
      );
      autoReviewRequiresHumanApproval = true;
    }
    const requestArgs = buildDefaultExecApprovalRequestArgs({
      warnings: params.warnings,
      approvalRunningNoticeMs: params.approvalRunningNoticeMs,
      createApprovalSlug,
      turnSourceChannel: params.turnSourceChannel,
      turnSourceAccountId: params.turnSourceAccountId,
    });
    const registerGatewayApproval = async (approvalId) =>
      await registerExecApprovalRequestForHostOrThrow({
        approvalId,
        command: params.command,
        env: params.requestedEnv,
        workdir: params.workdir,
        host: "gateway",
        security: hostSecurity,
        ask: hostAsk,
        ...unavailableDecisionRequestParams,
        commandHighlighting: params.commandHighlighting,
        warningText: params.warnings.join("\n").trim() || void 0,
        ...buildExecApprovalRequesterContext({
          agentId: params.agentId,
          sessionKey: params.sessionKey,
        }),
        approvalReviewerDeviceIds: params.approvalReviewerDeviceId
          ? [params.approvalReviewerDeviceId]
          : void 0,
        resolvedPath: resolveApprovalAuditTrustPath(
          allowlistEval.segments[0]?.resolution ?? null,
          params.workdir,
        ),
        ...buildExecApprovalTurnSourceContext(params),
      });
    const {
      approvalId,
      approvalSlug,
      warningText,
      expiresAtMs,
      preResolvedDecision,
      initiatingSurface,
      sentApproverDms,
      unavailableReason,
    } = await createAndRegisterDefaultExecApprovalRequest({
      ...requestArgs,
      register: registerGatewayApproval,
    });
    emitGatewayExecApprovalSecurityEvent({
      action: "exec.approval.requested",
      outcome: "success",
      severity: "low",
      agentId: params.agentId,
      hostSecurity,
      hostAsk,
      host: "gateway",
      segmentCount: allowlistEval.segments.length,
      trigger: params.trigger,
    });
    if (
      shouldResolveExecApprovalUnavailableInline({
        trigger: params.trigger,
        unavailableReason,
        preResolvedDecision,
      })
    ) {
      const { baseDecision, approvedByAsk, deniedReason } = applyTimedOutAllowlistFallback(
        createExecApprovalDecisionState({
          decision: preResolvedDecision,
          askFallback,
        }),
      );
      const strictInlineEvalDecision = enforceStrictInlineEvalApprovalBoundary({
        baseDecision,
        approvedByAsk,
        deniedReason,
        requiresInlineEvalApproval,
        requiresAutoReviewHumanApproval:
          autoReviewRequiresHumanApproval ||
          requiresHeredocApproval ||
          timedOutFallbackRequiresHeredocApproval,
      });
      if (strictInlineEvalDecision.deniedReason || !strictInlineEvalDecision.approvedByAsk) {
        const inlineDeniedReason = strictInlineEvalDecision.deniedReason ?? "approval-required";
        emitGatewayExecApprovalSecurityEvent({
          action: "exec.approval.denied",
          outcome: "denied",
          severity: "medium",
          agentId: params.agentId,
          reason: inlineDeniedReason,
          hostSecurity,
          hostAsk,
          host: "gateway",
          segmentCount: allowlistEval.segments.length,
          trigger: params.trigger,
          decision: preResolvedDecision,
        });
        throw new Error(
          buildHeadlessExecApprovalDeniedMessage({
            trigger: params.trigger,
            host: "gateway",
            security: hostSecurity,
            ask: hostAsk,
            askFallback,
          }),
        );
      }
      emitGatewayExecApprovalSecurityEvent({
        action: "exec.approval.approved",
        outcome: "success",
        severity: "medium",
        agentId: params.agentId,
        hostSecurity,
        hostAsk,
        host: "gateway",
        segmentCount: allowlistEval.segments.length,
        trigger: params.trigger,
        decision: preResolvedDecision,
      });
      await commitExecutionAuthorization({
        source: preResolvedDecision === null ? "ask-fallback" : "explicit-approval",
        resolvedPath: resolveApprovalAuditTrustPath(
          allowlistEval.segments[0]?.resolution ?? null,
          params.workdir,
        ),
        ...(preResolvedDecision === "allow-always"
          ? { allowAlwaysDecision: effectiveAllowAlwaysPersistence }
          : {}),
      });
      const execCommandOverride =
        preResolvedDecision === null && fallbackSecurity === "allowlist"
          ? fallbackEnforcedCommand
          : enforcedCommand;
      return {
        execCommandOverride,
        allowWithoutEnforcedCommand: execCommandOverride === void 0,
      };
    }
    const resolvedPath = resolveApprovalAuditTrustPath(
      allowlistEval.segments[0]?.resolution ?? null,
      params.workdir,
    );
    const resolveApprovalForExecution = async (onFailure) => {
      const decision = await resolveApprovalDecisionOrUndefined({
        approvalId,
        preResolvedDecision,
        onFailure,
      });
      if (decision === void 0) {
        emitGatewayExecApprovalSecurityEvent({
          action: "exec.approval.denied",
          outcome: "error",
          severity: "high",
          agentId: params.agentId,
          reason: "approval-request-failed",
          hostSecurity,
          hostAsk,
          host: "gateway",
          segmentCount: allowlistEval.segments.length,
          trigger: params.trigger,
        });
        return {
          deniedReason: "approval-request-failed",
          requestFailed: true,
          authorizationSource: "explicit-approval",
          allowAlwaysDecision: void 0,
        };
      }
      const initialDecisionState = createExecApprovalDecisionState({
        decision,
        askFallback,
      });
      const {
        baseDecision,
        approvedByAsk: baseApprovedByAsk,
        deniedReason: baseDeniedReason,
      } = applyTimedOutAllowlistFallback(initialDecisionState);
      let approvedByAsk = baseApprovedByAsk;
      let deniedReason = baseDeniedReason;
      if (decision === "allow-once") approvedByAsk = true;
      else if (decision === "allow-always") approvedByAsk = true;
      const strictBoundaryDecision = enforceStrictInlineEvalApprovalBoundary({
        baseDecision,
        approvedByAsk,
        deniedReason,
        requiresInlineEvalApproval,
        requiresAutoReviewHumanApproval:
          autoReviewRequiresHumanApproval ||
          requiresHeredocApproval ||
          timedOutFallbackRequiresHeredocApproval,
      });
      approvedByAsk = strictBoundaryDecision.approvedByAsk;
      deniedReason = strictBoundaryDecision.deniedReason;
      if (
        !approvedByAsk &&
        hasGatewayAllowlistMiss({
          hostSecurity,
          analysisOk,
          allowlistSatisfied,
          durableApprovalSatisfied,
        })
      )
        deniedReason = deniedReason ?? "allowlist-miss";
      emitGatewayExecApprovalSecurityEvent({
        action: deniedReason ? "exec.approval.denied" : "exec.approval.approved",
        outcome: deniedReason ? "denied" : "success",
        severity: "medium",
        agentId: params.agentId,
        reason: deniedReason ?? void 0,
        hostSecurity,
        hostAsk,
        host: "gateway",
        segmentCount: allowlistEval.segments.length,
        trigger: params.trigger,
        decision,
      });
      return {
        deniedReason,
        requestFailed: false,
        authorizationSource: decision === null ? "ask-fallback" : "explicit-approval",
        allowAlwaysDecision: decision === "allow-always" ? effectiveAllowAlwaysPersistence : void 0,
        execCommandOverride:
          decision === null && fallbackSecurity === "allowlist"
            ? fallbackEnforcedCommand
            : enforcedCommand,
      };
    };
    if (unavailableReason === null && shouldAwaitGatewayApprovalInline(params)) {
      const approvalDecision = await resolveApprovalForExecution(() => void 0);
      if (approvalDecision.deniedReason)
        return {
          deniedResult: buildGatewayExecApprovalDeniedToolResult({
            approvalId,
            deniedReason: approvalDecision.deniedReason,
            command: params.command,
            cwd: params.workdir,
          }),
        };
      await commitExecutionAuthorization({
        source: approvalDecision.authorizationSource,
        resolvedPath: resolvedPath ?? void 0,
        ...(approvalDecision.allowAlwaysDecision
          ? { allowAlwaysDecision: approvalDecision.allowAlwaysDecision }
          : {}),
      });
      return {
        execCommandOverride: approvalDecision.execCommandOverride,
        allowWithoutEnforcedCommand: approvalDecision.execCommandOverride === void 0,
      };
    }
    const effectiveTimeout =
      typeof params.timeoutSec === "number" ? params.timeoutSec : params.defaultTimeoutSec;
    const followupTarget = buildExecApprovalFollowupTarget({
      approvalId,
      sessionKey: params.notifySessionKey ?? params.sessionKey,
      expectedSessionId: params.sessionId,
      sessionStore: params.sessionStore,
      bashElevated: params.bashElevated,
      turnSourceChannel: params.turnSourceChannel,
      turnSourceTo: params.turnSourceTo,
      turnSourceAccountId: params.turnSourceAccountId,
      turnSourceThreadId: params.turnSourceThreadId,
      direct: params.approvalFollowupMode === "direct",
    });
    const denyApprovalStateWriteFailure = async () => {
      emitGatewayExecApprovalSecurityEvent({
        action: "exec.approval.denied",
        outcome: "error",
        severity: "high",
        agentId: params.agentId,
        reason: "approval-state-write-failed",
        hostSecurity,
        hostAsk,
        host: "gateway",
        segmentCount: allowlistEval.segments.length,
        trigger: params.trigger,
      });
      await sendExecApprovalFollowupResult(
        followupTarget,
        `Exec denied (gateway id=${approvalId}, approval-state-write-failed): ${params.command}`,
      );
    };
    (async () => {
      let approvalDecision;
      try {
        approvalDecision = await resolveApprovalForExecution(
          () =>
            void sendExecApprovalFollowupResult(
              followupTarget,
              `Exec denied (gateway id=${approvalId}, approval-request-failed): ${params.command}`,
            ),
        );
      } catch {
        await denyApprovalStateWriteFailure();
        return;
      }
      if (approvalDecision.requestFailed) return;
      if (approvalDecision.deniedReason) {
        await sendExecApprovalFollowupResult(
          followupTarget,
          `Exec denied (gateway id=${approvalId}, ${approvalDecision.deniedReason}): ${params.command}`,
        );
        return;
      }
      let admitted;
      try {
        admitted = await runWithGatewayIndependentRootWorkAdmission(async () => {
          try {
            await commitExecutionAuthorization({
              source: approvalDecision.authorizationSource,
              resolvedPath: resolvedPath ?? void 0,
              ...(approvalDecision.allowAlwaysDecision
                ? { allowAlwaysDecision: approvalDecision.allowAlwaysDecision }
                : {}),
            });
          } catch {
            return { status: "approval-state-write-failed" };
          }
          let run;
          try {
            run = await runExecProcess({
              command: params.command,
              execCommand: approvalDecision.execCommandOverride,
              workdir: params.workdir,
              env: params.env,
              pathPrepend: params.pathPrepend,
              sandbox: void 0,
              containerWorkdir: null,
              usePty: params.pty,
              warnings: params.warnings,
              maxOutput: params.maxOutput,
              pendingMaxOutput: params.pendingMaxOutput,
              notifyOnExit: false,
              notifyOnExitEmptySuccess: false,
              scopeKey: params.scopeKey,
              sessionKey: params.notifySessionKey ?? params.sessionKey,
              timeoutSec: effectiveTimeout,
            });
          } catch {
            return { status: "spawn-failed" };
          }
          markBackgrounded(run.session);
          return {
            status: "started",
            run,
          };
        });
      } catch (error) {
        if (
          error instanceof GatewayDrainingError ||
          (error instanceof Error && error.message === "gateway is draining for restart")
        ) {
          await sendExecApprovalFollowupResult(
            followupTarget,
            `Exec denied (gateway id=${approvalId}, gateway-draining): ${params.command}`,
          );
          return;
        }
        admitted = { status: "spawn-failed" };
      }
      if (admitted.status === "approval-state-write-failed") {
        await denyApprovalStateWriteFailure();
        return;
      }
      if (admitted.status === "spawn-failed") {
        await sendExecApprovalFollowupResult(
          followupTarget,
          `Exec denied (gateway id=${approvalId}, spawn-failed): ${params.command}`,
        );
        return;
      }
      const { run } = admitted;
      const outcome = await run.promise;
      const dynamicFollowupText = await resolveGatewayExecApprovalFollowupText({
        approvalFollowup: params.approvalFollowup,
        approvalId,
        sessionId: run.session.id,
        trigger: params.trigger,
        outcome,
      });
      const approvalFollowupText = normalizeStringEntries([
        params.approvalFollowupText ?? "",
        dynamicFollowupText ?? "",
      ]).join("\n\n");
      const summary = buildGatewayExecApprovalFollowupSummary({
        approvalId,
        sessionId: run.session.id,
        outcome,
        trigger: params.trigger,
        approvalFollowupText,
      });
      await sendExecApprovalFollowupResult(followupTarget, summary);
    })();
    return {
      pendingResult: buildExecApprovalPendingToolResult({
        host: "gateway",
        command: params.command,
        cwd: params.workdir,
        warningText,
        approvalId,
        approvalSlug,
        expiresAtMs,
        initiatingSurface,
        sentApproverDms,
        unavailableReason,
        allowedDecisions: approvalAllowedDecisions,
      }),
    };
  }
  if (
    hasGatewayAllowlistMiss({
      hostSecurity,
      analysisOk,
      allowlistSatisfied,
      durableApprovalSatisfied,
    })
  )
    throw new Error("exec denied: allowlist miss");
  await commitExecutionAuthorization({
    source: "current-policy",
    resolvedPath: resolveApprovalAuditTrustPath(
      allowlistEval.segments[0]?.resolution ?? null,
      params.workdir,
    ),
  });
  return { execCommandOverride: enforcedCommand };
}
//#endregion
//#region src/infra/node-shell.ts
/** Build argv for running a command through the platform default shell. */
function buildNodeShellCommand(command, platform) {
  const normalized = normalizeLowercaseStringOrEmpty((platform ?? "").trim());
  if (normalized.startsWith("win")) return ["cmd.exe", "/d", "/s", "/c", command];
  if (normalized === "darwin" || normalized.startsWith("macos")) return ["/bin/sh", "-c", command];
  return ["/bin/sh", "-lc", command];
}
//#endregion
//#region src/agents/bash-tools.exec-host-node-phases.ts
/**
 * Phase helpers for node-host exec.
 * Resolves nodes, prepares `system.run` payloads, analyzes remote approval
 * requirements, and formats node invoke results for the exec tool.
 */
function resolveNodeRunTimeoutSec(timeoutSec, defaultTimeoutSec) {
  return typeof timeoutSec === "number" && Number.isFinite(timeoutSec)
    ? timeoutSec
    : defaultTimeoutSec;
}
function resolveNodeInvokeTimeoutMs(runTimeoutSec, defaultTimeoutSec) {
  const baseTimeoutSec =
    Number.isFinite(runTimeoutSec) && runTimeoutSec > 0 ? runTimeoutSec : defaultTimeoutSec;
  if (!Number.isFinite(baseTimeoutSec) || baseTimeoutSec <= 0) return 1e4;
  return Math.max(1e4, addSafeTimeoutDelayGraceMs(baseTimeoutSec * 1e3, 5e3));
}
function resolveNodeRunTimeoutMs(runTimeoutSec) {
  return Number.isFinite(runTimeoutSec) && runTimeoutSec > 0
    ? addSafeTimeoutDelayGraceMs(runTimeoutSec * 1e3, 0, { minMs: 0 })
    : 0;
}
function hasExactCommandDurableApproval(params) {
  const normalizedCommand = params.commandText.trim();
  if (!normalizedCommand) return false;
  const commandPattern = `=command:${crypto.createHash("sha256").update(normalizedCommand).digest("hex").slice(0, 16)}`;
  return params.allowlist.some(
    (entry) =>
      entry.source === "allow-always" &&
      (entry.pattern === commandPattern ||
        (typeof entry.commandText === "string" && entry.commandText.trim() === normalizedCommand)),
  );
}
function extractPreparedNodeShellPayload(argv) {
  const extracted = extractShellCommandFromArgv([...argv]);
  if (extracted) return extracted;
  const executable = argv[0]?.split(/[\\/]/).pop()?.toLowerCase();
  const flag = argv[1]?.trim();
  const payload = argv[2]?.trim();
  if (argv.length === 3 && executable === "sh" && flag === "-lc" && payload) return payload;
  return null;
}
function buildNodeApprovalAnalysisEnv(env) {
  return {
    ...env,
    PATH: "",
    Path: "",
  };
}
function hasNodeAllowAlwaysCommandApproval(params) {
  const normalizedCommand = params.commandText.trim();
  if (!normalizedCommand) return false;
  if (params.segments.length === 0) return false;
  if (
    !hasNodeCommandAllowAlwaysMarker({
      allowlist: params.allowlist,
      commandText: normalizedCommand,
    })
  )
    return false;
  const matchingEntries = /* @__PURE__ */ new Set();
  for (const entry of params.allowlist) {
    if (entry.source !== "allow-always") continue;
    matchingEntries.add(`${entry.pattern}\x00${entry.argPattern ?? ""}`);
  }
  const coverage =
    params.nodeCoverage ??
    resolveAllowAlwaysPatternCoverage({
      segments: [...params.segments],
      cwd: params.cwd,
      env: params.env,
      platform: params.platform,
      strictInlineEval: params.strictInlineEval,
    });
  const expectedPatterns = coverage.patterns.map(
    (pattern) => `${pattern.pattern}\x00${pattern.argPattern ?? ""}`,
  );
  if (!coverage.complete || expectedPatterns.length === 0) return false;
  return expectedPatterns.every((pattern) => matchingEntries.has(pattern));
}
/** Returns true when local policy allows direct node invoke without prepare/approval. */
function shouldSkipNodeApprovalPrepare(params) {
  return (
    params.hostSecurity === "full" && params.hostAsk === "off" && params.strictInlineEval !== true
  );
}
/** Formats a raw `node.invoke system.run` response as an exec tool result. */
function formatNodeRunToolResult(params) {
  const payload = params.raw && typeof params.raw === "object" ? params.raw.payload : void 0;
  const payloadObj = payload && typeof payload === "object" ? payload : {};
  const stdout = typeof payloadObj.stdout === "string" ? payloadObj.stdout : "";
  const stderr = typeof payloadObj.stderr === "string" ? payloadObj.stderr : "";
  const errorText = typeof payloadObj.error === "string" ? payloadObj.error : "";
  const success = typeof payloadObj.success === "boolean" ? payloadObj.success : false;
  const exitCode = typeof payloadObj.exitCode === "number" ? payloadObj.exitCode : null;
  return {
    content: [
      {
        type: "text",
        text: renderExecUpdateText({
          tailText: stdout || stderr || errorText,
          warnings: params.warnings ?? [],
        }),
      },
    ],
    details: {
      status: success ? "completed" : "failed",
      exitCode,
      durationMs: Date.now() - params.startedAt,
      aggregated: [stdout, stderr, errorText].filter(Boolean).join("\n"),
      cwd: params.cwd,
    },
  };
}
/** Resolves the node id, platform, argv, env, and timeout for a node-host exec. */
async function resolveNodeExecutionTarget(params) {
  const nodes = await listNodes({});
  if (nodes.length === 0)
    throw new Error(
      "exec host=node requires a paired node (none available). This requires a companion app or node host.",
    );
  let resolvedBoundNodeId;
  if (params.boundNode)
    try {
      resolvedBoundNodeId = resolveNodeIdFromList(nodes, params.boundNode);
    } catch {}
  let resolvedRequestedNodeId;
  if (params.requestedNode)
    try {
      resolvedRequestedNodeId = resolveNodeIdFromList(nodes, params.requestedNode);
    } catch (err) {
      throw new Error(
        `requested node not found: ${params.requestedNode} (${err instanceof Error ? err.message : String(err)})`,
        { cause: err },
      );
    }
  const canonicalBound = resolvedBoundNodeId ?? params.boundNode;
  if (canonicalBound && resolvedRequestedNodeId && canonicalBound !== resolvedRequestedNodeId)
    throw new Error(
      `exec node not allowed (bound to ${canonicalBound}, requested resolved to ${resolvedRequestedNodeId})`,
    );
  const nodeQuery = resolvedBoundNodeId || resolvedRequestedNodeId || params.boundNode;
  let nodeId;
  try {
    nodeId = resolveNodeIdFromList(nodes, nodeQuery, !nodeQuery);
  } catch (err) {
    if (!nodeQuery && String(err).includes("node required"))
      throw new Error(
        "exec host=node requires a node id when multiple nodes are available (set tools.exec.node or exec.node).",
        { cause: err },
      );
    throw err;
  }
  const nodeInfo = nodes.find((entry) => entry.nodeId === nodeId);
  if (nodeInfo?.connected === false)
    throw new Error(
      `exec host=node requires a connected node (${nodeId} is currently disconnected). Start or reconnect the companion app or node host, or select a connected node.`,
    );
  const declaredCommands = Array.isArray(nodeInfo?.commands) ? nodeInfo.commands : [];
  if (!declaredCommands.includes("system.run"))
    throw new Error(
      "exec host=node requires a node that supports system.run (companion app or node host).",
    );
  const runTimeoutSec = resolveNodeRunTimeoutSec(params.timeoutSec, params.defaultTimeoutSec);
  return {
    nodeId,
    platform: nodeInfo?.platform,
    argv: buildNodeShellCommand(params.command, nodeInfo?.platform),
    env: params.requestedEnv ? { ...params.requestedEnv } : void 0,
    invokeTimeoutMs: resolveNodeInvokeTimeoutMs(runTimeoutSec, params.defaultTimeoutSec),
    runTimeoutSec,
    supportsSystemRunPrepare: declaredCommands.includes("system.run.prepare"),
  };
}
/** Builds the `node.invoke` payload for `system.run`. */
function buildNodeSystemRunInvoke(params) {
  const timeoutMs = resolveNodeRunTimeoutMs(params.target.runTimeoutSec);
  const runId = params.runId ?? crypto.randomUUID();
  return {
    nodeId: params.target.nodeId,
    command: "system.run",
    params: {
      command: params.command,
      rawCommand: params.rawCommand,
      ...(params.systemRunPlan ? { systemRunPlan: params.systemRunPlan } : {}),
      ...(params.cwd != null ? { cwd: params.cwd } : {}),
      env: params.target.env,
      timeoutMs,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      ...(params.turnSourceChannel != null ? { turnSourceChannel: params.turnSourceChannel } : {}),
      ...(params.turnSourceTo != null ? { turnSourceTo: params.turnSourceTo } : {}),
      ...(params.turnSourceAccountId != null
        ? { turnSourceAccountId: params.turnSourceAccountId }
        : {}),
      ...(params.turnSourceThreadId != null
        ? { turnSourceThreadId: params.turnSourceThreadId }
        : {}),
      approved: params.approved,
      approvalDecision: params.approvalDecision ?? void 0,
      approvalSource: params.approvalSource,
      runId,
      suppressNotifyOnExit:
        params.suppressNotifyOnExit === true || params.notifyOnExit === false ? true : void 0,
    },
    idempotencyKey: crypto.randomUUID(),
  };
}
/** Invokes `system.run` directly when approval policy is fully bypassed. */
async function invokeNodeSystemRunDirect(params) {
  const startedAt = Date.now();
  return formatNodeRunToolResult({
    raw: await callGatewayTool(
      "node.invoke",
      { timeoutMs: params.target.invokeTimeoutMs },
      buildNodeSystemRunInvoke({
        target: params.target,
        command: params.target.argv,
        rawCommand: params.request.command,
        cwd: params.request.workdir,
        agentId: params.request.agentId,
        sessionKey: params.request.sessionKey,
        notifyOnExit: params.request.notifyOnExit,
      }),
    ),
    startedAt,
    cwd: params.request.workdir,
    warnings: [...params.request.warnings, ...(params.request.foregroundWarnings ?? [])],
  });
}
/** Prepares a node-host system run using remote prepare support or local fallback. */
async function prepareNodeSystemRun(params) {
  if (!params.target.supportsSystemRunPrepare)
    throw new Error("exec denied: node approval requires system.run.prepare support");
  const prepared = parsePreparedSystemRunPayload(
    (
      await callGatewayTool(
        "node.invoke",
        { timeoutMs: 15e3 },
        {
          nodeId: params.target.nodeId,
          command: "system.run.prepare",
          params: {
            command: params.target.argv,
            rawCommand: params.request.command,
            ...(params.request.workdir != null ? { cwd: params.request.workdir } : {}),
            ...(params.target.env !== void 0 ? { env: params.target.env } : {}),
            ...(params.request.strictInlineEval === true ? { strictInlineEval: true } : {}),
            agentId: params.request.agentId,
            sessionKey: params.request.sessionKey,
          },
          idempotencyKey: crypto.randomUUID(),
        },
      )
    )?.payload,
  );
  if (!prepared) throw new Error("invalid system.run.prepare response");
  return {
    plan: prepared.plan,
    argv: prepared.plan.argv,
    rawCommand: prepared.plan.commandText,
    transportRawCommand: prepared.plan.commandText,
    cwd: prepared.plan.cwd ?? params.request.workdir,
    agentId: prepared.plan.agentId ?? params.request.agentId,
    sessionKey: prepared.plan.sessionKey ?? params.request.sessionKey,
    ...(prepared.execPolicy ? { execPolicy: prepared.execPolicy } : {}),
    allowAlwaysCoverage: prepared.allowAlwaysCoverage,
  };
}
/** Analyzes whether a prepared node run satisfies node/caller approval policy. */
async function analyzeNodeApprovalRequirement(params) {
  const approvalCommand = params.prepared.rawCommand;
  const approvalCwd = params.prepared.cwd ?? params.request.workdir;
  const analysisEnv = buildNodeApprovalAnalysisEnv(params.target.env);
  const baseAllowlistEval = await evaluateShellAllowlistWithAuthorization({
    command: approvalCommand,
    allowlist: [],
    safeBins: /* @__PURE__ */ new Set(),
    cwd: approvalCwd,
    env: analysisEnv,
    platform: params.target.platform,
    trustedSafeBinDirs: params.request.trustedSafeBinDirs,
  });
  const bindingCommandEvals = [
    {
      command: approvalCommand,
      cwd: approvalCwd,
      allowlistEval: baseAllowlistEval,
    },
  ];
  const addCommandEval = async (entries, command, cwd) => {
    const normalizedCommand = command?.trim();
    if (!normalizedCommand) return;
    if (entries.some((entry) => entry.command.trim() === normalizedCommand && entry.cwd === cwd))
      return;
    entries.push({
      command: normalizedCommand,
      cwd,
      allowlistEval: await evaluateShellAllowlistWithAuthorization({
        command: normalizedCommand,
        allowlist: [],
        safeBins: /* @__PURE__ */ new Set(),
        cwd,
        env: analysisEnv,
        platform: params.target.platform,
        trustedSafeBinDirs: params.request.trustedSafeBinDirs,
      }),
    });
  };
  const preparedCommand = resolveSystemRunCommandRequest({
    command: params.prepared.argv,
    rawCommand: params.prepared.rawCommand,
  });
  const preparedShellPayload =
    extractPreparedNodeShellPayload(params.prepared.argv) ??
    (preparedCommand.ok ? preparedCommand.shellPayload : null);
  await addCommandEval(bindingCommandEvals, preparedShellPayload, approvalCwd);
  const autoReviewBindingCommand = preparedShellPayload?.trim() || approvalCommand;
  const autoReviewBindingEval =
    bindingCommandEvals.find(
      (entry) =>
        entry.command.trim() === autoReviewBindingCommand.trim() && entry.cwd === approvalCwd,
    )?.allowlistEval ?? baseAllowlistEval;
  const policyCommandEvals = [...bindingCommandEvals];
  await addCommandEval(policyCommandEvals, params.prepared.plan.commandPreview, approvalCwd);
  await addCommandEval(policyCommandEvals, params.request.command, params.request.workdir);
  let analysisOk = baseAllowlistEval.analysisOk;
  let allowlistSatisfied = false;
  let durableApprovalSatisfied = false;
  let nodeApprovalsFileKnown = false;
  const inlineEvalHit =
    params.request.strictInlineEval === true
      ? (policyCommandEvals
          .map((entry) => detectPolicyInlineEval(entry.allowlistEval.segments))
          .find((hit) => hit !== null) ?? null)
      : null;
  if (inlineEvalHit)
    params.request.warnings.push(
      `Warning: strict inline-eval mode requires reviewer or explicit approval for ${describeInterpreterInlineEval(inlineEvalHit)}.`,
    );
  const requiresSecurityAuditSuppressionApproval =
    (preparedShellPayload && preparedShellPayload.trim().length > 0
      ? policyCommandEvals.filter(
          (entry) => entry.command.trim() !== approvalCommand.trim() || entry.cwd !== approvalCwd,
        )
      : policyCommandEvals
    ).some((entry) =>
      commandRequiresSecurityAuditSuppressionApproval({
        command: entry.command,
        cwd: entry.cwd,
        env: analysisEnv,
        segments: entry.allowlistEval.segments,
      }),
    ) && !(params.hostSecurity === "full" && params.hostAsk === "off");
  if (
    (params.hostAsk === "always" ||
      params.hostSecurity === "allowlist" ||
      params.request.autoReview === true) &&
    analysisOk
  )
    try {
      const approvalsSnapshot = await callGatewayTool(
        "exec.approvals.node.get",
        { timeoutMs: 1e4 },
        { nodeId: params.target.nodeId },
      );
      const approvalsFile =
        approvalsSnapshot && typeof approvalsSnapshot === "object"
          ? approvalsSnapshot.file
          : void 0;
      if (approvalsFile && typeof approvalsFile === "object") {
        nodeApprovalsFileKnown = true;
        const resolved = resolveExecApprovalsFromFile({
          file: approvalsFile,
          agentId: params.prepared.agentId,
          overrides: { security: "full" },
        });
        const allowlistEvals = await Promise.all(
          bindingCommandEvals.map(async (entry) => {
            const allowlistEval = await evaluateShellAllowlistWithAuthorization({
              command: entry.command,
              allowlist: resolved.allowlist,
              safeBins: /* @__PURE__ */ new Set(),
              cwd: entry.cwd,
              env: analysisEnv,
              platform: params.target.platform,
              trustedSafeBinDirs: params.request.trustedSafeBinDirs,
            });
            return {
              command: entry.command,
              allowlistEligible:
                !preparedShellPayload || entry.command.trim() === preparedShellPayload.trim(),
              exactDurableApprovalSatisfied: hasExactCommandDurableApproval({
                allowlist: resolved.allowlist,
                commandText: entry.command,
              }),
              nodeCommandDurableApprovalSatisfied: hasNodeAllowAlwaysCommandApproval({
                allowlist: resolved.allowlist,
                commandText: params.prepared.rawCommand,
                segments: entry.allowlistEval.segments,
                cwd: entry.cwd,
                env: analysisEnv,
                platform: params.target.platform,
                strictInlineEval: params.request.strictInlineEval,
                nodeCoverage: params.prepared.allowAlwaysCoverage,
              }),
              allowlistEval,
              durableApprovalSatisfied: hasDurableExecApproval({
                analysisOk: allowlistEval.analysisOk,
                segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
                allowlist: resolved.allowlist,
                commandText: entry.command,
              }),
            };
          }),
        );
        durableApprovalSatisfied = allowlistEvals.some(
          (entry) =>
            (entry.durableApprovalSatisfied &&
              (entry.allowlistEligible || entry.exactDurableApprovalSatisfied)) ||
            entry.nodeCommandDurableApprovalSatisfied,
        );
        allowlistSatisfied = allowlistEvals.some(
          (entry) => entry.allowlistEligible && entry.allowlistEval.allowlistSatisfied,
        );
        analysisOk = allowlistEvals.some((entry) => entry.allowlistEval.analysisOk);
      }
    } catch {}
  return {
    analysisOk,
    allowlistSatisfied,
    durableApprovalSatisfied,
    nodeApprovalPolicyKnown: nodeApprovalsFileKnown && params.prepared.execPolicy !== void 0,
    nodeSecurity: params.prepared.execPolicy?.security,
    nodeAsk: params.prepared.execPolicy?.ask,
    inlineEvalHit,
    requiresSecurityAuditSuppressionApproval,
    allowAlwaysPersistence: resolveAllowAlwaysPersistenceDecision({
      segments: baseAllowlistEval.segments,
      commandText: approvalCommand,
      cwd: approvalCwd,
      env: analysisEnv,
      platform: params.target.platform,
      strictInlineEval: params.request.strictInlineEval,
      authorizationPlan: baseAllowlistEval.authorizationPlan,
      runtimePayload: inlineEvalHit !== null,
      preparedCoverage: params.prepared.allowAlwaysCoverage,
    }),
    autoReviewArgv:
      autoReviewBindingEval.segments.length === 1 &&
      (autoReviewBindingEval.segments.at(0)?.raw === void 0 ||
        autoReviewBindingEval.segments.at(0)?.raw.trim() === autoReviewBindingCommand.trim())
        ? autoReviewBindingEval.segments.at(0)?.argv
        : void 0,
  };
}
//#endregion
//#region src/agents/bash-tools.exec-host-node.ts
/**
 * Node-host exec orchestration.
 * Combines local policy, remote node policy, auto-review, approval follow-ups,
 * and `node.invoke system.run` execution for host=node calls.
 */
const APPROVED_NODE_INVOKE_SCOPES = [WRITE_SCOPE, APPROVALS_SCOPE];
async function assertCurrentNodeGatewayPolicyAllowsDispatch(params) {
  const current = await resolveExecHostApprovalContext({
    agentId: params.request.agentId,
    security: params.request.security,
    ask: params.request.ask,
    host: "node",
  });
  if (current.hostSecurity === "deny") throw new Error("exec denied: host=node security=deny");
  if (params.authority === "human-approval") return;
  if (params.authority === "auto-review") {
    if (current.hostAsk === "always")
      throw new Error("exec denied: host=node ask=always requires human approval");
    return;
  }
  if (params.authority === "ask-fallback") {
    const expected = params.fallbackPolicy;
    if (
      !expected ||
      current.hostSecurity !== expected.hostSecurity ||
      current.hostAsk !== expected.hostAsk ||
      current.askFallback !== expected.askFallback
    )
      throw new Error("exec denied: host=node fallback policy changed before dispatch");
    return;
  }
  if (!params.currentPolicyAllows?.(current))
    throw new Error("exec denied: host=node policy changed before dispatch");
}
function resolveNodeAutoReviewReason(params) {
  if (params.inlineEvalHit !== null) return "strict-inline-eval";
  if (
    params.hostSecurity === "allowlist" &&
    (!params.analysisOk || !params.allowlistSatisfied) &&
    !params.durableApprovalSatisfied
  )
    return "allowlist-miss";
  return "approval-required";
}
function execSecurityFloorRank(security) {
  switch (security) {
    case "full":
      return 0;
    case "allowlist":
      return 1;
    case "deny":
      return 2;
  }
  throw new Error("Unsupported exec security floor");
}
function nodePolicyBlocksAutoReview(params) {
  return (
    !params.nodeApprovalPolicyKnown ||
    params.nodeAsk === "always" ||
    (params.nodeSecurity !== void 0 &&
      execSecurityFloorRank(params.nodeSecurity) > execSecurityFloorRank(params.hostSecurity))
  );
}
/**
 * Executes a command on a remote node, requesting approval when policy requires it.
 * Node-host approval combines caller policy and remote node approval snapshots.
 */
async function executeNodeHostCommand(params) {
  const { hostSecurity, hostAsk, askFallback } = await resolveExecHostApprovalContext({
    agentId: params.agentId,
    security: params.security,
    ask: params.ask,
    host: "node",
  });
  const target = await resolveNodeExecutionTarget(params);
  params.signal?.throwIfAborted();
  if (
    shouldSkipNodeApprovalPrepare({
      hostSecurity,
      hostAsk,
      strictInlineEval: params.strictInlineEval,
    })
  ) {
    await assertCurrentNodeGatewayPolicyAllowsDispatch({
      request: params,
      authority: "current-policy",
      currentPolicyAllows: (current) =>
        shouldSkipNodeApprovalPrepare({
          hostSecurity: current.hostSecurity,
          hostAsk: current.hostAsk,
          strictInlineEval: params.strictInlineEval,
        }),
    });
    return await invokeNodeSystemRunDirect({
      request: params,
      target,
    });
  }
  const prepared = await prepareNodeSystemRun({
    request: params,
    target,
  });
  const approvalAnalysis = await analyzeNodeApprovalRequirement({
    request: params,
    target,
    prepared,
    hostSecurity,
    hostAsk,
  });
  params.signal?.throwIfAborted();
  const {
    analysisOk,
    allowlistSatisfied,
    durableApprovalSatisfied,
    nodeApprovalPolicyKnown,
    nodeSecurity,
    nodeAsk,
    inlineEvalHit,
    requiresSecurityAuditSuppressionApproval,
    autoReviewArgv,
    allowAlwaysPersistence,
  } = approvalAnalysis;
  const approvalDecisionAsk =
    nodeApprovalPolicyKnown && nodeAsk !== void 0 ? maxAsk(hostAsk, nodeAsk) : "always";
  const allowedDecisions = resolveExecApprovalAllowedDecisions({
    ask: approvalDecisionAsk,
    allowAlwaysPersistence,
  });
  const unavailableDecisions = resolveExecApprovalUnavailableDecisions({
    ask: approvalDecisionAsk,
    allowAlwaysPersistence,
  });
  const unavailableDecisionRequestParams =
    unavailableDecisions.length > 0 ? { unavailableDecisions } : {};
  const requiresAsk =
    requiresExecApproval({
      ask: hostAsk,
      security: hostSecurity,
      analysisOk,
      allowlistSatisfied,
      durableApprovalSatisfied,
    }) ||
    inlineEvalHit !== null ||
    requiresSecurityAuditSuppressionApproval;
  if (requiresSecurityAuditSuppressionApproval)
    params.warnings.push(
      "Warning: security audit suppression changes require explicit approval unless exec is running in yolo mode.",
    );
  const registerNodeApproval = async (approvalId, options = {}) =>
    await registerExecApprovalRequestForHostOrThrow({
      approvalId,
      systemRunPlan: prepared.plan,
      env: target.env,
      workdir: prepared.cwd,
      host: "node",
      nodeId: target.nodeId,
      security: hostSecurity,
      ask: hostAsk,
      ...unavailableDecisionRequestParams,
      commandHighlighting: params.commandHighlighting,
      ...buildExecApprovalRequesterContext({
        agentId: prepared.agentId,
        sessionKey: prepared.sessionKey,
      }),
      approvalReviewerDeviceIds: params.approvalReviewerDeviceId
        ? [params.approvalReviewerDeviceId]
        : void 0,
      ...(options.requireDeliveryRoute !== void 0
        ? { requireDeliveryRoute: options.requireDeliveryRoute }
        : {}),
      ...(options.suppressDelivery !== void 0
        ? { suppressDelivery: options.suppressDelivery }
        : {}),
      ...buildExecApprovalTurnSourceContext(params),
    });
  const resolveCurrentTimeoutFallback = async () => {
    try {
      const current = await resolveExecHostApprovalContext({
        agentId: params.agentId,
        security: params.security,
        ask: params.ask,
        host: "node",
      });
      if (current.askFallback === "deny")
        return {
          approvedByAsk: false,
          deniedReason: "approval-timeout",
          hostSecurity: current.hostSecurity,
          hostAsk: current.hostAsk,
          askFallback: current.askFallback,
          requiresExplicitApproval: false,
        };
      const currentAnalysis = await analyzeNodeApprovalRequirement({
        request: {
          ...params,
          warnings: [],
        },
        target,
        prepared,
        hostSecurity: current.hostSecurity,
        hostAsk: current.hostAsk,
      });
      if (current.askFallback === "full")
        return {
          approvedByAsk: true,
          deniedReason: null,
          hostSecurity: current.hostSecurity,
          hostAsk: current.hostAsk,
          askFallback: current.askFallback,
          requiresExplicitApproval:
            currentAnalysis.inlineEvalHit !== null ||
            currentAnalysis.requiresSecurityAuditSuppressionApproval,
        };
      const authorizationSatisfied =
        currentAnalysis.durableApprovalSatisfied ||
        (currentAnalysis.analysisOk && currentAnalysis.allowlistSatisfied);
      return {
        approvedByAsk: authorizationSatisfied,
        deniedReason: authorizationSatisfied ? null : "approval-timeout: allowlist-miss",
        hostSecurity: current.hostSecurity,
        hostAsk: current.hostAsk,
        askFallback: current.askFallback,
        requiresExplicitApproval:
          currentAnalysis.inlineEvalHit !== null ||
          currentAnalysis.requiresSecurityAuditSuppressionApproval,
      };
    } catch {
      return {
        approvedByAsk: false,
        deniedReason: "approval-timeout: policy-unavailable",
        hostSecurity: "deny",
        hostAsk,
        askFallback: "deny",
        requiresExplicitApproval: false,
      };
    }
  };
  let inlineApprovedByAsk = false;
  let inlineApprovalDecision = null;
  let inlineApprovalSource;
  let inlineApprovalId;
  let inlineDispatchAuthority = "current-policy";
  let inlineFallbackPolicy;
  if (requiresAsk) {
    const autoReviewHasBoundCommand = analysisOk && autoReviewArgv !== void 0;
    const autoReviewBlockedByNodePolicy =
      params.autoReview === true &&
      hostAsk !== "always" &&
      nodePolicyBlocksAutoReview({
        hostSecurity,
        nodeApprovalPolicyKnown,
        nodeSecurity,
        nodeAsk,
      });
    let autoReviewRequiresHumanApproval =
      autoReviewBlockedByNodePolicy ||
      (params.autoReview === true && hostAsk !== "always" && !autoReviewHasBoundCommand) ||
      requiresSecurityAuditSuppressionApproval;
    if (
      params.autoReview === true &&
      hostAsk !== "always" &&
      autoReviewHasBoundCommand &&
      !autoReviewBlockedByNodePolicy &&
      !requiresSecurityAuditSuppressionApproval
    ) {
      const decision = await (params.autoReviewer ?? defaultExecAutoReviewer)({
        command: prepared.rawCommand,
        argv: autoReviewArgv,
        cwd: prepared.cwd,
        envKeys: Object.keys(params.requestedEnv ?? {}).toSorted(),
        host: "node",
        reason: resolveNodeAutoReviewReason({
          inlineEvalHit,
          hostSecurity,
          analysisOk,
          allowlistSatisfied,
          durableApprovalSatisfied,
        }),
        analysis: {
          parsed: analysisOk,
          allowlistMatched: allowlistSatisfied,
          durableApprovalMatched: durableApprovalSatisfied,
          inlineEval: inlineEvalHit !== null,
        },
        agent: {
          id: prepared.agentId,
          sessionKey: prepared.sessionKey,
        },
      });
      params.signal?.throwIfAborted();
      const autoReviewAllowed = decision.decision === "allow-once" && decision.risk === "low";
      if (autoReviewAllowed) {
        const approvalId = randomUUID();
        await registerNodeApproval(approvalId, {
          requireDeliveryRoute: false,
          suppressDelivery: true,
        });
        await callGatewayTool(
          "exec.approval.resolve",
          { timeoutMs: 15e3 },
          {
            id: approvalId,
            decision: "allow-once",
          },
          {
            scopes: [APPROVALS_SCOPE],
            requireAgentRuntimeIdentity: true,
          },
        );
        inlineApprovedByAsk = true;
        inlineApprovalDecision = "allow-once";
        inlineApprovalId = approvalId;
        inlineDispatchAuthority = "auto-review";
      }
      if (!autoReviewAllowed) {
        autoReviewRequiresHumanApproval = true;
        params.warnings.push(
          `Exec auto-review deferred to human approval (risk=${decision.risk}): ${decision.rationale}`,
        );
      }
    }
    if (!inlineApprovedByAsk) {
      const {
        approvalId,
        approvalSlug,
        warningText,
        expiresAtMs,
        preResolvedDecision,
        initiatingSurface,
        sentApproverDms,
        unavailableReason,
      } = await createAndRegisterDefaultExecApprovalRequest({
        ...buildDefaultExecApprovalRequestArgs({
          warnings: params.warnings,
          approvalRunningNoticeMs: params.approvalRunningNoticeMs,
          createApprovalSlug,
          turnSourceChannel: params.turnSourceChannel,
          turnSourceAccountId: params.turnSourceAccountId,
        }),
        register: registerNodeApproval,
      });
      if (
        shouldResolveExecApprovalUnavailableInline({
          trigger: params.trigger,
          unavailableReason,
          preResolvedDecision,
        })
      ) {
        const {
          baseDecision,
          approvedByAsk: initialApprovedByAsk,
          deniedReason: initialDeniedReason,
        } = createExecApprovalDecisionState({
          decision: preResolvedDecision,
          askFallback,
        });
        let approvedByAsk = initialApprovedByAsk;
        let deniedReason = initialDeniedReason;
        const currentFallback = baseDecision.timedOut
          ? await resolveCurrentTimeoutFallback()
          : null;
        if (currentFallback) {
          approvedByAsk = currentFallback.approvedByAsk;
          deniedReason = currentFallback.deniedReason;
        }
        const strictInlineEvalDecision = enforceStrictInlineEvalApprovalBoundary({
          baseDecision,
          approvedByAsk,
          deniedReason,
          requiresInlineEvalApproval:
            currentFallback?.requiresExplicitApproval ?? inlineEvalHit !== null,
          requiresAutoReviewHumanApproval: autoReviewRequiresHumanApproval,
        });
        if (strictInlineEvalDecision.deniedReason || !strictInlineEvalDecision.approvedByAsk)
          throw new Error(
            buildHeadlessExecApprovalDeniedMessage({
              trigger: params.trigger,
              host: "node",
              security: currentFallback?.hostSecurity ?? hostSecurity,
              ask: currentFallback?.hostAsk ?? hostAsk,
              askFallback: currentFallback?.askFallback ?? askFallback,
            }),
          );
        inlineApprovedByAsk = strictInlineEvalDecision.approvedByAsk;
        inlineApprovalSource = preResolvedDecision === null ? "ask-fallback" : void 0;
        if (inlineApprovalSource) {
          inlineDispatchAuthority = "ask-fallback";
          inlineFallbackPolicy = currentFallback ?? void 0;
        } else inlineDispatchAuthority = "human-approval";
        inlineApprovalDecision = inlineApprovalSource
          ? null
          : strictInlineEvalDecision.approvedByAsk
            ? "allow-once"
            : null;
        inlineApprovalId = approvalId;
      } else {
        const followupTarget = buildExecApprovalFollowupTarget({
          approvalId,
          sessionKey: params.notifySessionKey ?? params.sessionKey,
          expectedSessionId: params.sessionId,
          sessionStore: params.sessionStore,
          bashElevated: params.bashElevated,
          turnSourceChannel: params.turnSourceChannel,
          turnSourceTo: params.turnSourceTo,
          turnSourceAccountId: params.turnSourceAccountId,
          turnSourceThreadId: params.turnSourceThreadId,
        });
        (async () => {
          const decision = await resolveApprovalDecisionOrUndefined({
            approvalId,
            preResolvedDecision,
            onFailure: () =>
              void sendExecApprovalFollowupResult(
                followupTarget,
                `Exec denied (node=${target.nodeId} id=${approvalId}, approval-request-failed): ${params.command}`,
              ),
          });
          if (decision === void 0) return;
          const {
            baseDecision,
            approvedByAsk: initialApprovedByAsk,
            deniedReason: baseDeniedReason,
          } = createExecApprovalDecisionState({
            decision,
            askFallback,
          });
          let approvedByAsk = initialApprovedByAsk;
          let approvalDecision = null;
          const approvalSource = decision === null ? "ask-fallback" : void 0;
          let deniedReason = baseDeniedReason;
          const currentFallback = baseDecision.timedOut
            ? await resolveCurrentTimeoutFallback()
            : null;
          if (currentFallback) {
            approvedByAsk = currentFallback.approvedByAsk;
            deniedReason = currentFallback.deniedReason;
            approvalDecision = approvedByAsk ? "allow-once" : null;
          } else if (decision === "allow-once") {
            approvedByAsk = true;
            approvalDecision = "allow-once";
          } else if (decision === "allow-always") {
            approvedByAsk = true;
            approvalDecision = "allow-always";
          }
          const strictBoundaryDecision = enforceStrictInlineEvalApprovalBoundary({
            baseDecision,
            approvedByAsk,
            deniedReason,
            requiresInlineEvalApproval:
              currentFallback?.requiresExplicitApproval ?? inlineEvalHit !== null,
            requiresAutoReviewHumanApproval: autoReviewRequiresHumanApproval,
          });
          approvedByAsk = strictBoundaryDecision.approvedByAsk;
          deniedReason = strictBoundaryDecision.deniedReason;
          if (deniedReason) approvalDecision = null;
          if (deniedReason) {
            await sendExecApprovalFollowupResult(
              followupTarget,
              `Exec denied (node=${target.nodeId} id=${approvalId}, ${deniedReason}): ${params.command}`,
            );
            return;
          }
          try {
            await assertCurrentNodeGatewayPolicyAllowsDispatch({
              request: params,
              authority: approvalSource ? "ask-fallback" : "human-approval",
              fallbackPolicy: currentFallback ?? void 0,
            });
            const raw = await callGatewayTool(
              "node.invoke",
              { timeoutMs: target.invokeTimeoutMs },
              buildNodeSystemRunInvoke({
                target,
                command: prepared.argv,
                rawCommand: prepared.transportRawCommand,
                cwd: prepared.cwd,
                agentId: prepared.agentId,
                sessionKey: prepared.sessionKey,
                turnSourceChannel: params.turnSourceChannel,
                turnSourceTo: params.turnSourceTo,
                turnSourceAccountId: params.turnSourceAccountId,
                turnSourceThreadId: params.turnSourceThreadId,
                approved: approvalSource ? void 0 : approvedByAsk,
                approvalDecision: approvalSource
                  ? null
                  : approvalDecision === "allow-always" && inlineEvalHit !== null
                    ? "allow-once"
                    : approvalDecision,
                approvalSource,
                runId: approvalId,
                suppressNotifyOnExit: true,
                notifyOnExit: params.notifyOnExit,
                systemRunPlan: prepared.plan,
              }),
              { scopes: APPROVED_NODE_INVOKE_SCOPES },
            );
            const payload = raw?.payload && typeof raw.payload === "object" ? raw.payload : {};
            const output = normalizeNotifyOutput(
              tail([payload.stdout, payload.stderr, payload.error].filter(Boolean).join("\n"), 400),
            );
            const exitLabel = payload.timedOut ? "timeout" : `code ${payload.exitCode ?? "?"}`;
            const summary = output
              ? `Exec finished (node=${target.nodeId} id=${approvalId}, ${exitLabel})\n${output}`
              : `Exec finished (node=${target.nodeId} id=${approvalId}, ${exitLabel})`;
            await sendExecApprovalFollowupResult(followupTarget, summary);
          } catch {
            await sendExecApprovalFollowupResult(
              followupTarget,
              `Exec denied (node=${target.nodeId} id=${approvalId}, invoke-failed): ${params.command}`,
            );
          }
        })();
        return buildExecApprovalPendingToolResult({
          host: "node",
          command: params.command,
          cwd: params.workdir,
          warningText,
          approvalId,
          approvalSlug,
          expiresAtMs,
          initiatingSurface,
          sentApproverDms,
          unavailableReason,
          allowedDecisions,
          nodeId: target.nodeId,
        });
      }
    }
  }
  const startedAt = Date.now();
  params.signal?.throwIfAborted();
  const invoke = buildNodeSystemRunInvoke({
    target,
    command: prepared.argv,
    rawCommand: prepared.transportRawCommand,
    cwd: prepared.cwd,
    agentId: prepared.agentId,
    sessionKey: prepared.sessionKey,
    approved: inlineApprovalSource ? void 0 : inlineApprovedByAsk,
    approvalDecision: inlineApprovalSource ? null : inlineApprovalDecision,
    approvalSource: inlineApprovalSource,
    runId: inlineApprovalId,
    notifyOnExit: params.notifyOnExit,
    systemRunPlan: prepared.plan,
  });
  await assertCurrentNodeGatewayPolicyAllowsDispatch({
    request: params,
    authority: inlineDispatchAuthority,
    fallbackPolicy: inlineFallbackPolicy,
    currentPolicyAllows: (current) =>
      !requiresExecApproval({
        ask: current.hostAsk,
        security: current.hostSecurity,
        analysisOk,
        allowlistSatisfied,
        durableApprovalSatisfied,
      }) &&
      inlineEvalHit === null &&
      !requiresSecurityAuditSuppressionApproval,
  });
  return formatNodeRunToolResult({
    raw:
      (inlineApprovedByAsk || inlineApprovalSource) && inlineApprovalId
        ? await callGatewayTool("node.invoke", { timeoutMs: target.invokeTimeoutMs }, invoke, {
            scopes: APPROVED_NODE_INVOKE_SCOPES,
          })
        : await callGatewayTool("node.invoke", { timeoutMs: target.invokeTimeoutMs }, invoke),
    startedAt,
    cwd: params.workdir,
    warnings: [...params.warnings, ...(params.foregroundWarnings ?? [])],
  });
}
//#endregion
//#region src/agents/bash-tools.exec-workdir.ts
/**
 * Internal exec workdir resolver.
 * Owns cwd selection and validation before exec approval, hooks, preflight, or
 * process launch can observe an invalid selected working directory.
 */
function normalizeExplicitWorkdirInput(workdir) {
  if (workdir === void 0) return { kind: "omitted" };
  const value = normalizeOptionalString(workdir);
  return value
    ? {
        kind: "specified",
        value,
      }
    : {
        kind: "blank",
        raw: workdir,
      };
}
function unavailable(requestedCwd) {
  return {
    kind: "unavailable",
    requestedCwd,
  };
}
function resolveExistingHostWorkdir(workdir) {
  return safeStatSync(workdir)?.isDirectory() ? workdir : null;
}
function isHostPathInsideRoot(params) {
  const root = path.resolve(params.root);
  const candidate = path.resolve(params.candidate);
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
function safeCurrentCwd() {
  try {
    return process.cwd();
  } catch {
    return null;
  }
}
function mapContainerWorkdirToHost(params) {
  const workdir = normalizeContainerPath(params.workdir);
  const containerRoot = normalizeContainerPath(params.sandbox.containerWorkdir);
  if (containerRoot === ".") return;
  if (workdir === containerRoot) return path.resolve(params.sandbox.workspaceDir);
  if (!workdir.startsWith(`${containerRoot}/`)) return;
  const rel = workdir
    .slice(containerRoot.length + 1)
    .split("/")
    .filter(Boolean);
  return path.resolve(params.sandbox.workspaceDir, ...rel);
}
function normalizeContainerPath(input) {
  const normalized = input.trim().replace(/\\/g, "/");
  if (!normalized) return ".";
  const posixPath = path.posix.normalize(normalized);
  return posixPath === "/" ? posixPath : posixPath.replace(/\/+$/g, "");
}
function joinContainerWorkdir(containerWorkdir, relative) {
  return relative ? path.posix.join(containerWorkdir, relative) : containerWorkdir;
}
function hasParentPathSegment(input) {
  return input
    .replace(/\\/g, "/")
    .split("/")
    .some((segment) => segment === "..");
}
function isContainerWorkdirInsideRoot(params) {
  const root = normalizeContainerPath(params.root);
  const workdir = normalizeContainerPath(params.workdir);
  if (root === "/") return path.posix.isAbsolute(workdir);
  return workdir === root || workdir.startsWith(`${root}/`);
}
function resolveBackendWorkdirRoots(sandbox) {
  const roots = [];
  const addRoot = (root) => {
    const normalized = normalizeContainerPath(root ?? "");
    if (normalized === "." || !path.posix.isAbsolute(normalized) || roots.includes(normalized))
      return;
    roots.push(normalized);
  };
  addRoot(sandbox.containerWorkdir);
  for (const root of sandbox.workdirRoots ?? []) addRoot(root);
  return roots;
}
function resolveBackendContainerWorkdir(params) {
  const containerRoot = normalizeContainerPath(params.sandbox.containerWorkdir);
  const backendRoots = resolveBackendWorkdirRoots(params.sandbox);
  const requested = normalizeContainerPath(params.workdir);
  if (path.posix.isAbsolute(requested))
    return backendRoots.some((root) =>
      isContainerWorkdirInsideRoot({
        root,
        workdir: requested,
      }),
    )
      ? requested
      : null;
  if (requested === ".." || requested.startsWith("../")) return null;
  return joinContainerWorkdir(containerRoot, requested === "." ? "" : requested);
}
async function mapExistingHostWorkspacePath(params) {
  let resolved;
  try {
    resolved = await assertSandboxPath({
      filePath: params.hostPath,
      cwd: params.sandbox.workspaceDir,
      root: params.sandbox.workspaceDir,
    });
  } catch {
    return { kind: "invalid" };
  }
  const stats = safeStatSync(resolved.resolved);
  if (!stats)
    return {
      kind: "missing",
      relative: resolved.relative ? resolved.relative.split(path.sep).join(path.posix.sep) : "",
    };
  if (!stats.isDirectory()) return { kind: "invalid" };
  const relative = resolved.relative ? resolved.relative.split(path.sep).join(path.posix.sep) : "";
  return {
    kind: "available",
    workdir: {
      hostCwd: resolved.resolved,
      containerCwd: joinContainerWorkdir(params.sandbox.containerWorkdir, relative),
      scriptPreflightCwd: resolved.resolved,
    },
  };
}
async function validateBackendWorkdir(params) {
  const containerCwd = await params.sandbox.validateWorkdir?.(params.workdir.containerCwd);
  return containerCwd
    ? {
        hostCwd: params.workdir.hostCwd,
        containerCwd,
        scriptPreflightCwd: params.workdir.scriptPreflightCwd,
      }
    : null;
}
function resolveBackendHostWorkdirCandidate(params) {
  if (!path.isAbsolute(params.workdir))
    return {
      hostPath: path.resolve(params.sandbox.workspaceDir, params.workdir),
      failIfInvalid: false,
    };
  const hostPath = path.resolve(params.workdir);
  if (
    isHostPathInsideRoot({
      root: params.sandbox.workspaceDir,
      candidate: hostPath,
    })
  )
    return {
      hostPath,
      failIfInvalid: true,
    };
  const containerMappedHostPath = mapContainerWorkdirToHost({
    workdir: params.workdir,
    sandbox: params.sandbox,
  });
  return containerMappedHostPath
    ? {
        hostPath: containerMappedHostPath,
        failIfInvalid: false,
      }
    : null;
}
async function resolveBackendValidatedSandboxWorkdir(params) {
  const workspaceHostCwd = resolveExistingHostWorkdir(params.sandbox.workspaceDir);
  if (!workspaceHostCwd) return null;
  const hostCandidate = resolveBackendHostWorkdirCandidate(params);
  if (hostCandidate) {
    const mappedWorkdir = await mapExistingHostWorkspacePath({
      hostPath: hostCandidate.hostPath,
      sandbox: params.sandbox,
    });
    if (mappedWorkdir.kind === "available")
      return await validateBackendWorkdir({
        workdir: mappedWorkdir.workdir,
        sandbox: params.sandbox,
      });
    if (mappedWorkdir.kind === "missing")
      return await validateBackendWorkdir({
        workdir: {
          hostCwd: workspaceHostCwd,
          containerCwd: joinContainerWorkdir(
            params.sandbox.containerWorkdir,
            mappedWorkdir.relative,
          ),
          scriptPreflightCwd: null,
        },
        sandbox: params.sandbox,
      });
    if (hostCandidate.failIfInvalid && mappedWorkdir.kind === "invalid") return null;
  }
  const containerCwd = resolveBackendContainerWorkdir(params);
  if (containerCwd)
    return await validateBackendWorkdir({
      workdir: {
        hostCwd: workspaceHostCwd,
        containerCwd,
        scriptPreflightCwd: null,
      },
      sandbox: params.sandbox,
    });
  return null;
}
async function resolveHostValidatedSandboxWorkdir(params) {
  const candidateWorkdir =
    mapContainerWorkdirToHost({
      workdir: params.workdir,
      sandbox: params.sandbox,
    }) ?? params.workdir;
  try {
    const resolved = await assertSandboxPath({
      filePath: candidateWorkdir,
      cwd: params.sandbox.workspaceDir,
      root: params.sandbox.workspaceDir,
    });
    if (!(await fs$1.stat(resolved.resolved)).isDirectory()) return null;
    const relative = resolved.relative
      ? resolved.relative.split(path.sep).join(path.posix.sep)
      : "";
    const containerCwd = joinContainerWorkdir(params.sandbox.containerWorkdir, relative);
    return {
      hostCwd: resolved.resolved,
      containerCwd,
      scriptPreflightCwd: resolved.resolved,
    };
  } catch {
    return null;
  }
}
async function resolveSandboxWorkdir(params) {
  if (hasParentPathSegment(params.workdir)) return null;
  if (params.sandbox.workdirValidation === "backend")
    return await resolveBackendValidatedSandboxWorkdir(params);
  return await resolveHostValidatedSandboxWorkdir(params);
}
function formatUnavailableWorkdirFailure(workdir) {
  return [
    `workdir "${workdir}" is unavailable or not a directory: command was not executed.`,
    'workdir is treated as a literal path; shell expansions such as "~" are not applied.',
    "Use an existing directory, omit an explicit workdir to use the default cwd, or update the configured default cwd.",
  ].join(" ");
}
async function resolveExecWorkdir(params) {
  const explicitWorkdir = normalizeExplicitWorkdirInput(params.workdir);
  if (explicitWorkdir.kind === "blank") return unavailable(explicitWorkdir.raw);
  if (params.host === "node") {
    const remoteCwd =
      explicitWorkdir.kind === "specified"
        ? explicitWorkdir.value
        : normalizeOptionalString(params.nodeCwd);
    return remoteCwd
      ? {
          kind: "node",
          remoteCwd,
        }
      : { kind: "node" };
  }
  const defaultCwd = normalizeOptionalString(params.defaultCwd);
  if (params.host === "sandbox") {
    const sandbox = params.sandbox;
    if (!sandbox)
      throw new Error("exec internal error: sandbox workdir resolution requires sandbox config");
    const requestedCwd =
      explicitWorkdir.kind === "specified"
        ? explicitWorkdir.value
        : (defaultCwd ?? sandbox.containerWorkdir);
    const resolved = await resolveSandboxWorkdir({
      workdir: requestedCwd,
      sandbox,
    });
    return resolved
      ? {
          kind: "sandbox",
          hostCwd: resolved.hostCwd,
          containerCwd: resolved.containerCwd,
          scriptPreflightCwd: resolved.scriptPreflightCwd,
        }
      : unavailable(requestedCwd);
  }
  const requestedCwd =
    explicitWorkdir.kind === "specified" ? explicitWorkdir.value : (defaultCwd ?? safeCurrentCwd());
  if (!requestedCwd) return unavailable("current working directory");
  const resolved = resolveExistingHostWorkdir(requestedCwd);
  return resolved
    ? {
        kind: "local",
        hostCwd: resolved,
      }
    : unavailable(requestedCwd);
}
//#endregion
//#region src/agents/bash-tools.exec.ts
/**
 * Exec tool factory and request pipeline.
 * Resolves host/sandbox/node target, policy, approval, env, script preflight,
 * process launch, foreground result, and background session handoff.
 */
const CHANNEL_CONTEXT_ENV_KEY = "OPENCLAW_CHANNEL_CONTEXT";
function buildSubprocessChannelContext(channelContext) {
  const senderId = normalizeOptionalString(channelContext?.sender?.id);
  const chatId = normalizeOptionalString(channelContext?.chat?.id);
  const subprocessContext = {
    ...(senderId ? { sender: { id: senderId } } : {}),
    ...(chatId ? { chat: { id: chatId } } : {}),
  };
  return subprocessContext.sender || subprocessContext.chat ? subprocessContext : void 0;
}
function buildChannelContextEnv(channelContext) {
  const subprocessContext = buildSubprocessChannelContext(channelContext);
  if (!subprocessContext) return;
  const serialized = safeJsonStringify(subprocessContext);
  return serialized ? { [CHANNEL_CONTEXT_ENV_KEY]: serialized } : void 0;
}
const resolvedExecEnvPreparedStates = /* @__PURE__ */ new WeakMap();
const deferredResolveExecEnvPreparedStates = /* @__PURE__ */ new WeakMap();
const resolvedExecWorkdirPreparedStates = /* @__PURE__ */ new WeakMap();
const XML_ARG_VALUE_EXEC_PARAM_KEYS = ["command", "workdir", "host", "security", "ask", "node"];
function isExecToolArgsObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function filterPluginExecEnv(rawEnv) {
  const env = {};
  for (const [rawKey, value] of Object.entries(rawEnv)) {
    const key = normalizeHostOverrideEnvVarKey(rawKey);
    if (!key) continue;
    const upperKey = key.toUpperCase();
    if (
      upperKey === "PATH" ||
      upperKey === "OPENCLAW_CLI" ||
      isDangerousHostEnvVarName(upperKey) ||
      isDangerousHostEnvOverrideVarName(upperKey)
    )
      continue;
    env[key] = value;
  }
  return Object.keys(env).length > 0 ? env : void 0;
}
function markResolveExecEnvPrepared(params, state = {}) {
  resolvedExecEnvPreparedStates.set(params, state);
  return params;
}
function getResolvedExecEnvPreparedState(params) {
  return resolvedExecEnvPreparedStates.get(params);
}
function isResolveExecEnvPrepared(params) {
  return Boolean(getResolvedExecEnvPreparedState(params));
}
function markDeferredResolveExecEnvPrepared(params, state) {
  deferredResolveExecEnvPreparedStates.set(params, state);
  return params;
}
function getDeferredResolveExecEnvPreparedState(params) {
  return deferredResolveExecEnvPreparedStates.get(params);
}
function markResolvedExecWorkdirPrepared(params, state) {
  resolvedExecWorkdirPreparedStates.set(params, state);
  return params;
}
function getResolvedExecWorkdirPreparedState(params) {
  return resolvedExecWorkdirPreparedStates.get(params);
}
function buildExecForegroundResult(params) {
  const warningText = params.warningText?.trim() ? `${params.warningText}\n\n` : "";
  if (params.outcome.status === "failed")
    return failedTextResult(`${warningText}${params.outcome.reason}`, {
      status: "failed",
      exitCode: params.outcome.exitCode ?? null,
      exitSignal: params.outcome.exitSignal,
      failureKind: params.outcome.failureKind,
      exitReason: params.outcome.exitReason,
      durationMs: params.outcome.durationMs,
      aggregated: params.outcome.aggregated,
      timedOut: params.outcome.timedOut,
      noOutputTimedOut: params.outcome.noOutputTimedOut,
      cwd: params.cwd,
    });
  return textResult(`${warningText}${renderExecOutputText(params.outcome.aggregated)}`, {
    status: "completed",
    exitCode: params.outcome.exitCode,
    exitSignal: params.outcome.exitSignal,
    exitReason: params.outcome.exitReason,
    durationMs: params.outcome.durationMs,
    aggregated: params.outcome.aggregated,
    noOutputTimedOut: params.outcome.noOutputTimedOut,
    cwd: params.cwd,
  });
}
const PREFLIGHT_ENV_OPTIONS_WITH_VALUES = /* @__PURE__ */ new Set([
  "-C",
  "-S",
  "-u",
  "--argv0",
  "--block-signal",
  "--chdir",
  "--default-signal",
  "--ignore-signal",
  "--split-string",
  "--unset",
]);
const SKIPPABLE_SCRIPT_PREFLIGHT_FS_ERROR_CODES = /* @__PURE__ */ new Set([
  "EACCES",
  "EISDIR",
  "ELOOP",
  "EINVAL",
  "ENAMETOOLONG",
  "ENOENT",
  "ENOTDIR",
  "EPERM",
]);
const SCRIPT_PREFLIGHT_MAX_BYTES = 512 * 1024;
const FS_CONSTANTS_WITH_OPTIONAL_NONBLOCK = constants;
const SCRIPT_PREFLIGHT_OPEN_FLAGS =
  constants.O_RDONLY | (FS_CONSTANTS_WITH_OPTIONAL_NONBLOCK.O_NONBLOCK ?? 0);
function getNodeErrorCode(error) {
  if (typeof error !== "object" || error === null || !("code" in error)) return;
  return String(error.code);
}
const fsSafeModuleLoader = createLazyImportLoader(() => import("./fs-safe-D2Yqi9_w.js"));
async function loadFsSafeModule() {
  return await fsSafeModuleLoader.load();
}
function shouldSkipScriptPreflightPathError(error, FsSafeError) {
  if (error instanceof FsSafeError) return true;
  const errorCode = getNodeErrorCode(error);
  return Boolean(errorCode && SKIPPABLE_SCRIPT_PREFLIGHT_FS_ERROR_CODES.has(errorCode));
}
function resolvePreflightRelativePath(params) {
  const root = path.resolve(params.rootDir);
  const candidate = path.resolve(params.absPath);
  const relative = path.relative(root, candidate);
  if (/^\.\.(?:[\\/]|$)/u.test(relative) || path.isAbsolute(relative)) return null;
  return relative;
}
function hasLeadingTildePathSegment(relativePath) {
  return /^~(?:$|[\\/])/u.test(relativePath);
}
async function readLiteralTildePreflightScript(params) {
  let handle;
  try {
    handle = await fs$1.open(params.absPath, SCRIPT_PREFLIGHT_OPEN_FLAGS);
    const stat = await handle.stat();
    if (!stat.isFile()) throw new params.fsSafe.FsSafeError("not-file", "not a file");
    if (stat.size > SCRIPT_PREFLIGHT_MAX_BYTES)
      throw new params.fsSafe.FsSafeError(
        "too-large",
        `file exceeds limit of ${SCRIPT_PREFLIGHT_MAX_BYTES} bytes (got ${stat.size})`,
      );
    const realPath = await params.fsSafe.resolveOpenedFileRealPathForHandle(handle, params.absPath);
    if (!params.fsSafe.isPathInside(params.workspaceRoot.rootReal, realPath))
      throw new params.fsSafe.FsSafeError("outside-workspace", "file is outside workspace root");
    const buffer = await handle.readFile();
    if (buffer.byteLength > SCRIPT_PREFLIGHT_MAX_BYTES)
      throw new params.fsSafe.FsSafeError(
        "too-large",
        `file exceeds limit of ${SCRIPT_PREFLIGHT_MAX_BYTES} bytes (got ${buffer.byteLength})`,
      );
    return buffer.toString("utf-8");
  } finally {
    await handle?.close().catch(() => void 0);
  }
}
function isShellEnvAssignmentToken(token) {
  return /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(token);
}
function isEnvExecutableToken(token) {
  if (!token) return false;
  const base = normalizeOptionalLowercaseString(token.split(/[\\/]/u).at(-1)) ?? "";
  return (base.endsWith(".exe") ? base.slice(0, -4) : base) === "env";
}
function stripPreflightEnvPrefix(argv) {
  if (argv.length === 0) return argv;
  let idx = 0;
  while (idx < argv.length && isShellEnvAssignmentToken(argv.at(idx) ?? "")) idx += 1;
  if (!isEnvExecutableToken(argv[idx])) return argv;
  idx += 1;
  while (idx < argv.length) {
    const token = argv.at(idx);
    if (token === void 0) break;
    if (token === "--") {
      idx += 1;
      break;
    }
    if (isShellEnvAssignmentToken(token)) {
      idx += 1;
      continue;
    }
    if (!token.startsWith("-") || token === "-") break;
    idx += 1;
    const equalsIndex = token.indexOf("=");
    const option = token.includes("=") ? token.slice(0, equalsIndex) : token;
    if (PREFLIGHT_ENV_OPTIONS_WITH_VALUES.has(option) && !token.includes("=") && idx < argv.length)
      idx += 1;
  }
  return argv.slice(idx);
}
function findFirstPythonScriptArg(tokens) {
  const optionsWithSeparateValue = /* @__PURE__ */ new Set([
    "-W",
    "-X",
    "-Q",
    "--check-hash-based-pycs",
  ]);
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens.at(i);
    if (token === void 0) break;
    if (token === "--") {
      const next = tokens.at(i + 1);
      return next && normalizeLowercaseStringOrEmpty(next).endsWith(".py") ? next : null;
    }
    if (token === "-") return null;
    if (token === "-c" || token === "-m") return null;
    if ((token.startsWith("-c") || token.startsWith("-m")) && token.length > 2) return null;
    if (optionsWithSeparateValue.has(token)) {
      i += 1;
      continue;
    }
    if (token.startsWith("-")) continue;
    return normalizeLowercaseStringOrEmpty(token).endsWith(".py") ? token : null;
  }
  return null;
}
function findNodeScriptArgs(tokens) {
  const optionsWithSeparateValue = /* @__PURE__ */ new Set(["-r", "--require", "--import"]);
  const preloadScripts = [];
  let entryScript = null;
  let hasInlineEvalOrPrint = false;
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens.at(i);
    if (token === void 0) break;
    if (token === "--") {
      if (!hasInlineEvalOrPrint && !entryScript) {
        const next = tokens.at(i + 1);
        if (next && normalizeLowercaseStringOrEmpty(next).endsWith(".js")) entryScript = next;
      }
      break;
    }
    if (
      token === "-e" ||
      token === "-p" ||
      token === "--eval" ||
      token === "--print" ||
      token.startsWith("--eval=") ||
      token.startsWith("--print=") ||
      ((token.startsWith("-e") || token.startsWith("-p")) && token.length > 2)
    ) {
      hasInlineEvalOrPrint = true;
      if (token === "-e" || token === "-p" || token === "--eval" || token === "--print") i += 1;
      continue;
    }
    if (optionsWithSeparateValue.has(token)) {
      const next = tokens.at(i + 1);
      if (next && normalizeLowercaseStringOrEmpty(next).endsWith(".js")) preloadScripts.push(next);
      i += 1;
      continue;
    }
    if (
      (token.startsWith("-r") && token.length > 2) ||
      token.startsWith("--require=") ||
      token.startsWith("--import=")
    ) {
      const inlineValue = token.startsWith("-r")
        ? token.slice(2)
        : token.slice(token.indexOf("=") + 1);
      if (normalizeLowercaseStringOrEmpty(inlineValue).endsWith(".js"))
        preloadScripts.push(inlineValue);
      continue;
    }
    if (token.startsWith("-")) continue;
    if (
      !hasInlineEvalOrPrint &&
      !entryScript &&
      normalizeLowercaseStringOrEmpty(token).endsWith(".js")
    )
      entryScript = token;
    break;
  }
  const targets = [...preloadScripts];
  if (entryScript) targets.push(entryScript);
  return targets;
}
function extractInterpreterScriptTargetFromArgv(argv) {
  if (!argv || argv.length === 0) return null;
  let commandIdx = 0;
  while (commandIdx < argv.length && /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(argv.at(commandIdx) ?? ""))
    commandIdx += 1;
  const executable = normalizeOptionalLowercaseString(argv.at(commandIdx));
  if (!executable) return null;
  const args = argv.slice(commandIdx + 1);
  if (/^python(?:3(?:\.\d+)?)?$/i.test(executable)) {
    const script = findFirstPythonScriptArg(args);
    if (script)
      return {
        kind: "python",
        relOrAbsPaths: [script],
      };
    return null;
  }
  if (executable === "node") {
    const scripts = findNodeScriptArgs(args);
    if (scripts.length > 0)
      return {
        kind: "node",
        relOrAbsPaths: scripts,
      };
    return null;
  }
  return null;
}
function extractInterpreterScriptPathsFromSegment(rawSegment) {
  const argv = splitShellArgs(rawSegment.trim());
  if (!argv || argv.length === 0) return [];
  return (
    extractInterpreterScriptTargetFromArgv(
      stripPreflightEnvPrefix(
        /^(?:if|then|do|elif|else|while|until|time)$/i.test(argv[0] ?? "") ? argv.slice(1) : argv,
      ),
    )?.relOrAbsPaths ?? []
  );
}
function extractScriptTargetFromCommand(command) {
  const raw = command.trim();
  const splitShellArgsPreservingBackslashes = (value) => {
    const tokens = [];
    let buf = "";
    let inSingle = false;
    let inDouble = false;
    const pushToken = () => {
      if (buf.length > 0) {
        tokens.push(buf);
        buf = "";
      }
    };
    for (const ch of value) {
      if (inSingle) {
        if (ch === "'") inSingle = false;
        else buf += ch;
        continue;
      }
      if (inDouble) {
        if (ch === '"') inDouble = false;
        else buf += ch;
        continue;
      }
      if (ch === "'") {
        inSingle = true;
        continue;
      }
      if (ch === '"') {
        inDouble = true;
        continue;
      }
      if (/\s/.test(ch)) {
        pushToken();
        continue;
      }
      buf += ch;
    }
    if (inSingle || inDouble) return null;
    pushToken();
    return tokens;
  };
  const candidateArgv =
    process.platform === "win32" &&
    /(?:^|[\s"'`])(?:[A-Za-z]:\\|\\\\|[^\s"'`|&;()<>]+\\[^\s"'`|&;()<>]+)/.test(raw)
      ? [splitShellArgsPreservingBackslashes(raw)]
      : [splitShellArgs(raw)];
  for (const argv of candidateArgv) {
    const attempts = [argv, argv ? stripPreflightEnvPrefix(argv) : null];
    for (const attempt of attempts) {
      const target = extractInterpreterScriptTargetFromArgv(attempt);
      if (target) return target;
    }
  }
  return null;
}
function extractUnquotedShellText(raw) {
  let out = "";
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (escaped) {
      if (!inSingle && !inDouble) out += `\\${ch}`;
      escaped = false;
      continue;
    }
    if (!inSingle && ch === "\\") {
      escaped = true;
      continue;
    }
    if (inSingle) {
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      const next = raw[i + 1];
      if (ch === "\\" && next && /[\\'"$`\n\r]/.test(next)) {
        i += 1;
        continue;
      }
      if (ch === '"') inDouble = false;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    out += ch;
  }
  if (escaped || inSingle || inDouble) return null;
  return out;
}
function splitShellSegmentsOutsideQuotes(rawText, params) {
  const segments = [];
  let buf = "";
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  const pushSegment = () => {
    if (buf.trim().length > 0) segments.push(buf);
    buf = "";
  };
  for (let i = 0; i < rawText.length; i += 1) {
    const ch = rawText[i];
    const next = rawText[i + 1];
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (!inSingle && ch === "\\") {
      buf += ch;
      escaped = true;
      continue;
    }
    if (inSingle) {
      buf += ch;
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      buf += ch;
      if (ch === '"') inDouble = false;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      buf += ch;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      buf += ch;
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      pushSegment();
      continue;
    }
    if (ch === ";") {
      pushSegment();
      continue;
    }
    if (ch === "&" && next === "&") {
      pushSegment();
      i += 1;
      continue;
    }
    if (ch === "|" && next === "|") {
      pushSegment();
      i += 1;
      continue;
    }
    if (params.splitPipes && ch === "|") {
      pushSegment();
      continue;
    }
    buf += ch;
  }
  pushSegment();
  return segments;
}
function isInterpreterExecutable(executable) {
  if (!executable) return false;
  return /^python(?:3(?:\.\d+)?)?$/i.test(executable) || executable === "node";
}
function hasUnescapedSequence(raw, sequence) {
  if (sequence.length === 0) return false;
  let escaped = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (raw.startsWith(sequence, i)) return true;
  }
  return false;
}
function hasUnquotedScriptHint(raw) {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  let token = "";
  const flushToken = () => {
    const normalizedToken = normalizeLowercaseStringOrEmpty(token);
    if (normalizedToken.endsWith(".py") || normalizedToken.endsWith(".js")) return true;
    token = "";
    return false;
  };
  for (const ch of raw) {
    if (escaped) {
      if (!inSingle && !inDouble) token += ch;
      escaped = false;
      continue;
    }
    if (!inSingle && ch === "\\") {
      escaped = true;
      continue;
    }
    if (inSingle) {
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (ch === '"') inDouble = false;
      continue;
    }
    if (ch === "'") {
      if (flushToken()) return true;
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      if (flushToken()) return true;
      inDouble = true;
      continue;
    }
    if (/\s/u.test(ch) || "|&;()<>".includes(ch)) {
      if (flushToken()) return true;
      continue;
    }
    token += ch;
  }
  return flushToken();
}
function resolveLeadingShellSegmentExecutable(rawSegment) {
  const argv = splitShellArgs((extractUnquotedShellText(rawSegment) ?? rawSegment).trim());
  if (!argv || argv.length === 0) return;
  const withoutLeadingKeyword = /^(?:if|then|do|elif|else|while|until|time)$/i.test(argv[0] ?? "")
    ? argv.slice(1)
    : argv;
  if (withoutLeadingKeyword.length === 0) return;
  const normalizedArgv = stripPreflightEnvPrefix(withoutLeadingKeyword);
  let commandIdx = 0;
  while (
    commandIdx < normalizedArgv.length &&
    /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(normalizedArgv[commandIdx] ?? "")
  )
    commandIdx += 1;
  return normalizeOptionalLowercaseString(normalizedArgv[commandIdx]);
}
function analyzeInterpreterHeuristicsFromUnquoted(raw) {
  const hasPython = splitShellSegmentsOutsideQuotes(raw, { splitPipes: true }).some((segment) =>
    /^python(?:3(?:\.\d+)?)?$/i.test(resolveLeadingShellSegmentExecutable(segment) ?? ""),
  );
  const hasNode = splitShellSegmentsOutsideQuotes(raw, { splitPipes: true }).some(
    (segment) => resolveLeadingShellSegmentExecutable(segment) === "node",
  );
  const hasProcessSubstitution = hasUnescapedSequence(raw, "<(") || hasUnescapedSequence(raw, ">(");
  return {
    hasPython,
    hasNode,
    hasComplexSyntax:
      hasUnescapedSequence(raw, "|") ||
      hasUnescapedSequence(raw, "&&") ||
      hasUnescapedSequence(raw, "||") ||
      hasUnescapedSequence(raw, ";") ||
      raw.includes("\n") ||
      raw.includes("\r") ||
      hasUnescapedSequence(raw, "$(") ||
      hasUnescapedSequence(raw, "`") ||
      hasProcessSubstitution,
    hasProcessSubstitution,
    hasScriptHint: hasUnquotedScriptHint(raw),
  };
}
function extractShellWrappedCommandPayload(executable, args) {
  if (!executable) return null;
  const executableBase = normalizeOptionalLowercaseString(executable.split(/[\\/]/u).at(-1)) ?? "";
  const normalizedExecutable = executableBase.endsWith(".exe")
    ? executableBase.slice(0, -4)
    : executableBase;
  if (!/^(?:bash|dash|fish|ksh|sh|zsh)$/i.test(normalizedExecutable)) return null;
  const shortOptionsWithSeparateValue = /* @__PURE__ */ new Set(["-O", "-o"]);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args.at(i);
    if (arg === void 0) break;
    if (arg === "--") return null;
    if (arg === "-c") return args.at(i + 1) ?? null;
    if (/^-[A-Za-z]+$/u.test(arg)) {
      if (arg.includes("c")) return args.at(i + 1) ?? null;
      if (shortOptionsWithSeparateValue.has(arg)) i += 1;
      continue;
    }
    if (/^--[A-Za-z0-9][A-Za-z0-9-]*(?:=.*)?$/u.test(arg)) {
      if (!arg.includes("=")) {
        const next = args.at(i + 1);
        if (next && next !== "--" && !next.startsWith("-")) i += 1;
      }
      continue;
    }
    return null;
  }
  return null;
}
function shouldFailClosedInterpreterPreflight(command) {
  const raw = command.trim();
  const rawArgv = splitShellArgs(raw);
  const argv = rawArgv ? stripPreflightEnvPrefix(rawArgv) : null;
  let commandIdx = 0;
  if (argv)
    while (commandIdx < argv.length && /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(argv[commandIdx] ?? ""))
      commandIdx += 1;
  const directExecutable = normalizeOptionalLowercaseString(argv?.[commandIdx]);
  const args = argv ? argv.slice(commandIdx + 1) : [];
  const isDirectInterpreterCommand =
    Boolean(directExecutable && /^python(?:3(?:\.\d+)?)?$/i.test(directExecutable)) ||
    directExecutable === "node";
  const topLevel = analyzeInterpreterHeuristicsFromUnquoted(extractUnquotedShellText(raw) ?? raw);
  const shellWrappedPayload = extractShellWrappedCommandPayload(directExecutable, args);
  const nestedUnquoted = shellWrappedPayload
    ? (extractUnquotedShellText(shellWrappedPayload) ?? shellWrappedPayload)
    : "";
  const nested = shellWrappedPayload
    ? analyzeInterpreterHeuristicsFromUnquoted(nestedUnquoted)
    : {
        hasPython: false,
        hasNode: false,
        hasComplexSyntax: false,
        hasProcessSubstitution: false,
        hasScriptHint: false,
      };
  const hasInterpreterInvocationInSegment = (rawSegment) =>
    isInterpreterExecutable(resolveLeadingShellSegmentExecutable(rawSegment));
  const isScriptExecutingInterpreterCommand = (rawCommand) => {
    const argvLocal = splitShellArgs(rawCommand.trim());
    if (!argvLocal || argvLocal.length === 0) return false;
    const withoutLeadingKeyword = /^(?:if|then|do|elif|else|while|until|time)$/i.test(
      argvLocal[0] ?? "",
    )
      ? argvLocal.slice(1)
      : argvLocal;
    if (withoutLeadingKeyword.length === 0) return false;
    const normalizedArgv = stripPreflightEnvPrefix(withoutLeadingKeyword);
    let commandIdxLocal = 0;
    while (
      commandIdxLocal < normalizedArgv.length &&
      /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(normalizedArgv[commandIdxLocal] ?? "")
    )
      commandIdxLocal += 1;
    const executable = normalizeOptionalLowercaseString(normalizedArgv[commandIdxLocal]);
    if (!executable) return false;
    const argsLocal = normalizedArgv.slice(commandIdxLocal + 1);
    if (/^python(?:3(?:\.\d+)?)?$/i.test(executable)) {
      const pythonInfoOnlyFlags = /* @__PURE__ */ new Set(["-V", "--version", "-h", "--help"]);
      if (argsLocal.some((arg) => pythonInfoOnlyFlags.has(arg))) return false;
      if (
        argsLocal.some(
          (arg) =>
            arg === "-c" ||
            arg === "-m" ||
            arg.startsWith("-c") ||
            arg.startsWith("-m") ||
            arg === "--check-hash-based-pycs",
        )
      )
        return false;
      return true;
    }
    if (executable === "node") {
      const nodeInfoOnlyFlags = /* @__PURE__ */ new Set([
        "-v",
        "--version",
        "-h",
        "--help",
        "-c",
        "--check",
      ]);
      if (argsLocal.some((arg) => nodeInfoOnlyFlags.has(arg))) return false;
      if (
        argsLocal.some(
          (arg) =>
            arg === "-e" ||
            arg === "-p" ||
            arg === "--eval" ||
            arg === "--print" ||
            arg.startsWith("--eval=") ||
            arg.startsWith("--print=") ||
            ((arg.startsWith("-e") || arg.startsWith("-p")) && arg.length > 2),
        )
      )
        return false;
      return true;
    }
    return false;
  };
  const hasScriptHintInSegment = (segment) =>
    extractInterpreterScriptPathsFromSegment(segment).length > 0 || hasUnquotedScriptHint(segment);
  const hasInterpreterAndScriptHintInSameSegment = (rawText) => {
    return splitShellSegmentsOutsideQuotes(rawText, { splitPipes: true }).some((segment) => {
      if (!isScriptExecutingInterpreterCommand(segment)) return false;
      return hasScriptHintInSegment(segment);
    });
  };
  const hasInterpreterPipelineScriptHintInSameSegment = (rawText) => {
    return splitShellSegmentsOutsideQuotes(rawText, { splitPipes: false }).some((segment) => {
      if (
        !splitShellSegmentsOutsideQuotes(segment, { splitPipes: true })
          .slice(1)
          .some((pipelineCommand) => isScriptExecutingInterpreterCommand(pipelineCommand))
      )
        return false;
      return hasScriptHintInSegment(segment);
    });
  };
  const hasInterpreterSegmentScriptHint =
    hasInterpreterAndScriptHintInSameSegment(raw) ||
    (shellWrappedPayload !== null && hasInterpreterAndScriptHintInSameSegment(shellWrappedPayload));
  const hasInterpreterPipelineScriptHint =
    hasInterpreterPipelineScriptHintInSameSegment(raw) ||
    (shellWrappedPayload !== null &&
      hasInterpreterPipelineScriptHintInSameSegment(shellWrappedPayload));
  const hasShellWrappedInterpreterSegmentScriptHint =
    shellWrappedPayload !== null && hasInterpreterAndScriptHintInSameSegment(shellWrappedPayload);
  const hasShellWrappedInterpreterInvocation =
    (nested.hasPython || nested.hasNode) &&
    (hasShellWrappedInterpreterSegmentScriptHint ||
      nested.hasScriptHint ||
      nested.hasComplexSyntax ||
      nested.hasProcessSubstitution);
  const hasTopLevelInterpreterInvocation = splitShellSegmentsOutsideQuotes(raw, {
    splitPipes: true,
  }).some((segment) => hasInterpreterInvocationInSegment(segment));
  return {
    hasInterpreterInvocation:
      isDirectInterpreterCommand ||
      hasShellWrappedInterpreterInvocation ||
      hasTopLevelInterpreterInvocation,
    hasComplexSyntax: topLevel.hasComplexSyntax || hasShellWrappedInterpreterInvocation,
    hasProcessSubstitution: topLevel.hasProcessSubstitution || nested.hasProcessSubstitution,
    hasInterpreterSegmentScriptHint,
    hasInterpreterPipelineScriptHint,
    isDirectInterpreterCommand,
  };
}
async function validateScriptFileForShellBleed(params) {
  const target = extractScriptTargetFromCommand(params.command);
  if (!target) {
    const {
      hasInterpreterInvocation,
      hasComplexSyntax,
      hasProcessSubstitution,
      hasInterpreterSegmentScriptHint,
      hasInterpreterPipelineScriptHint,
      isDirectInterpreterCommand,
    } = shouldFailClosedInterpreterPreflight(params.command);
    if (
      hasInterpreterInvocation &&
      hasComplexSyntax &&
      (hasInterpreterSegmentScriptHint ||
        hasInterpreterPipelineScriptHint ||
        (hasProcessSubstitution && isDirectInterpreterCommand))
    )
      throw new Error(
        "exec preflight: complex interpreter invocation detected; refusing to run without script preflight validation. Use a direct `python <file>.py` or `node <file>.js` command.",
      );
    return;
  }
  const fsSafe = await loadFsSafeModule();
  const { FsSafeError, root: fsRoot } = fsSafe;
  const workspaceRoot = await fsRoot(params.workdir);
  for (const relOrAbsPath of target.relOrAbsPaths) {
    const absPath = path.isAbsolute(relOrAbsPath)
      ? path.resolve(relOrAbsPath)
      : path.resolve(params.workdir, relOrAbsPath);
    const relativePath = resolvePreflightRelativePath({
      rootDir: params.workdir,
      absPath,
    });
    if (!relativePath) continue;
    let content;
    try {
      content = hasLeadingTildePathSegment(relativePath)
        ? await readLiteralTildePreflightScript({
            absPath,
            fsSafe,
            workspaceRoot,
          })
        : (
            await workspaceRoot.read(relativePath, {
              nonBlockingRead: true,
              symlinks: "follow-within-root",
              maxBytes: SCRIPT_PREFLIGHT_MAX_BYTES,
            })
          ).buffer.toString("utf-8");
    } catch (error) {
      if (shouldSkipScriptPreflightPathError(error, FsSafeError)) continue;
      throw error;
    }
    const first = /\$[A-Z_][A-Z0-9_]{1,}/g.exec(content);
    if (first) {
      const idx = first.index;
      const line = content.slice(0, idx).split("\n").length;
      const token = first[0];
      throw new Error(
        [
          `exec preflight: detected likely shell variable injection (${token}) in ${target.kind} script: ${path.basename(absPath)}:${line}.`,
          target.kind === "python"
            ? `In Python, use os.environ.get(${JSON.stringify(token.slice(1))}) instead of raw ${token}.`
            : `In Node.js, use process.env[${JSON.stringify(token.slice(1))}] instead of raw ${token}.`,
          "(If this is inside a string literal on purpose, escape it or restructure the code.)",
        ].join("\n"),
      );
    }
    if (target.kind === "node") {
      const firstNonEmpty = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .find((l) => l.length > 0);
      if (firstNonEmpty && /^NODE\b/.test(firstNonEmpty))
        throw new Error(
          `exec preflight: JS file starts with shell syntax (${firstNonEmpty}). This looks like a shell command, not JavaScript.`,
        );
    }
  }
}
function shouldSkipExecScriptPreflight(params) {
  return params.host === "gateway" && params.security === "full" && params.ask === "off";
}
function resolveExecReviewerDefaults(params) {
  if (params.defaults?.reviewer) return params.defaults.reviewer;
  const cfg = params.defaults?.config;
  const agentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
  return (
    (agentId
      ? cfg?.agents?.list?.find((entry) => normalizeAgentId(entry.id) === agentId)?.tools?.exec
      : void 0
    )?.reviewer ?? cfg?.tools?.exec?.reviewer
  );
}
function resolveNotifyOnExitEmptySuccess(defaults) {
  if (typeof defaults?.notifyOnExitEmptySuccess === "boolean")
    return defaults.notifyOnExitEmptySuccess;
  return normalizeChatChannelId(defaults?.messageProvider) !== null;
}
/** Creates an exec tool instance with runtime defaults and approval policy wiring. */
function createExecTool(defaults) {
  const defaultBackgroundMs = clampWithDefault(
    defaults?.backgroundMs ?? readEnvInt("OPENCLAW_BASH_YIELD_MS", "PI_BASH_YIELD_MS"),
    1e4,
    10,
    12e4,
  );
  const allowBackground = defaults?.allowBackground ?? true;
  const defaultTimeoutSec =
    typeof defaults?.timeoutSec === "number" && defaults.timeoutSec > 0
      ? defaults.timeoutSec
      : 1800;
  const defaultPathPrepend = normalizePathPrepend(defaults?.pathPrepend);
  const {
    safeBins,
    safeBinProfiles,
    trustedSafeBinDirs,
    unprofiledSafeBins,
    unprofiledInterpreterSafeBins,
  } = resolveExecSafeBinRuntimePolicy({
    local: {
      safeBins: defaults?.safeBins,
      safeBinTrustedDirs: defaults?.safeBinTrustedDirs,
      safeBinProfiles: defaults?.safeBinProfiles,
    },
    onWarning: (message) => {
      logInfo(message);
    },
  });
  if (unprofiledSafeBins.length > 0)
    logInfo(
      `exec: ignoring unprofiled safeBins entries (${unprofiledSafeBins.toSorted().join(", ")}); use allowlist or define tools.exec.safeBinProfiles.<bin>`,
    );
  if (unprofiledInterpreterSafeBins.length > 0)
    logInfo(
      `exec: interpreter/runtime binaries in safeBins (${unprofiledInterpreterSafeBins.join(", ")}) are unsafe without explicit hardened profiles; prefer allowlist entries`,
    );
  const notifyOnExit = defaults?.notifyOnExit !== false;
  const notifyOnExitEmptySuccess = resolveNotifyOnExitEmptySuccess(defaults);
  const notifySessionKey = normalizeOptionalString(defaults?.sessionKey);
  const notifyDeliveryContext = normalizeDeliveryContext({
    channel: defaults?.messageProvider,
    to: defaults?.currentChannelId,
    accountId: defaults?.accountId,
    threadId: defaults?.currentThreadTs,
  });
  const approvalRunningNoticeMs = resolveApprovalRunningNoticeMs(defaults?.approvalRunningNoticeMs);
  const parsedAgentSession = parseAgentSessionKey(defaults?.sessionKey);
  const agentId =
    defaults?.agentId ??
    (parsedAgentSession ? resolveAgentIdFromSessionKey(defaults?.sessionKey) : void 0);
  const resolveHostForParams = (params) => {
    const elevatedDefaults = defaults?.elevated;
    const elevatedAllowed = Boolean(elevatedDefaults?.enabled && elevatedDefaults.allowed);
    const elevatedDefaultMode =
      elevatedDefaults?.defaultLevel === "full"
        ? "full"
        : elevatedDefaults?.defaultLevel === "ask"
          ? "ask"
          : elevatedDefaults?.defaultLevel === "on"
            ? "ask"
            : "off";
    const effectiveDefaultMode = elevatedAllowed ? elevatedDefaultMode : "off";
    const elevatedMode =
      typeof params.elevated === "boolean"
        ? params.elevated
          ? elevatedDefaultMode === "full"
            ? "full"
            : "ask"
          : "off"
        : effectiveDefaultMode;
    const requestedTarget = requireValidExecTarget(params.host);
    return resolveExecTarget({
      configuredTarget: defaults?.host,
      requestedTarget,
      elevatedRequested: elevatedMode !== "off",
      sandboxAvailable: Boolean(defaults?.sandbox),
    }).effectiveHost;
  };
  const buildUnavailableWorkdirResult = (params) =>
    buildExecForegroundResult({
      outcome: buildExecRuntimeErrorOutcome({
        error: formatUnavailableWorkdirFailure(params.cwd),
        aggregated: "",
        durationMs: params.startedAt ? Date.now() - params.startedAt : 0,
      }),
      cwd: params.cwd,
      warningText: params.warningText,
    });
  const prepareParamsWithResolvedExecWorkdir = async (rawArgs) => {
    if (typeof rawArgs !== "object" || rawArgs === null || Array.isArray(rawArgs)) return rawArgs;
    const params = stripMalformedXmlArgValueSuffixFromKeys(rawArgs, XML_ARG_VALUE_EXEC_PARAM_KEYS);
    let host;
    try {
      host = resolveHostForParams(params);
    } catch {
      return params;
    }
    if (host === "sandbox" && !defaults?.sandbox) return params;
    if (host === "sandbox" && defaults?.sandbox?.workdirValidation === "backend") return params;
    const resolution = await resolveExecWorkdir({
      host,
      workdir: params.workdir,
      defaultCwd: defaults?.cwd,
      nodeCwd: defaults?.nodeCwd,
      sandbox: defaults?.sandbox,
    });
    return markResolvedExecWorkdirPrepared(params, {
      host,
      inputWorkdir: params.workdir,
      resolution,
    });
  };
  const shouldDeferResolveExecEnvUntilWorkdirValidated = (params) => {
    try {
      return (
        resolveHostForParams(params) === "sandbox" &&
        defaults?.sandbox?.workdirValidation === "backend"
      );
    } catch {
      return false;
    }
  };
  const prepareParamsWithResolvedExecEnv = async (rawArgs, context) => {
    const params = stripMalformedXmlArgValueSuffixFromKeys(rawArgs, XML_ARG_VALUE_EXEC_PARAM_KEYS);
    if (!params.command) return params;
    if (isResolveExecEnvPrepared(params)) return markResolveExecEnvPrepared(params);
    const hookRunner = getGlobalHookRunner();
    if (
      !hookRunner?.hasHooks("resolve_exec_env") ||
      typeof hookRunner.runResolveExecEnv !== "function"
    )
      return markResolveExecEnvPrepared(params);
    let host;
    try {
      host = resolveHostForParams(params);
    } catch {
      return params;
    }
    const pluginEnv = filterPluginExecEnv(
      await hookRunner.runResolveExecEnv(
        {
          sessionKey: defaults?.sessionKey ?? context?.hookContext?.sessionKey,
          toolName: "exec",
          host,
        },
        {
          agentId: agentId ?? context?.hookContext?.agentId,
          sessionKey: defaults?.sessionKey ?? context?.hookContext?.sessionKey,
          messageProvider: defaults?.messageProvider,
          channelId: defaults?.currentChannelId ?? context?.hookContext?.channelId,
          ...(defaults?.channelContext ? { channelContext: defaults.channelContext } : {}),
        },
      ),
    );
    return markResolveExecEnvPrepared(params, {
      host,
      ...(pluginEnv ? { pluginEnv } : {}),
    });
  };
  const autoReviewer =
    defaults?.autoReviewer ??
    createModelExecAutoReviewer({
      cfg: defaults?.config,
      agentId,
      reviewer: resolveExecReviewerDefaults({
        defaults,
        agentId,
      }),
    });
  return {
    name: "exec",
    label: "exec",
    displaySummary: EXEC_TOOL_DISPLAY_SUMMARY,
    get description() {
      return describeExecTool({
        agentId,
        hasCronTool: defaults?.hasCronTool === true,
      });
    },
    parameters: execSchema,
    prepareBeforeToolCallParams: async (args, context) => {
      const params = await prepareParamsWithResolvedExecWorkdir(args);
      if (getResolvedExecWorkdirPreparedState(params)?.resolution.kind === "unavailable")
        return params;
      if (!isExecToolArgsObject(params)) return params;
      if (shouldDeferResolveExecEnvUntilWorkdirValidated(params))
        return markDeferredResolveExecEnvPrepared(params, { hookContext: context.hookContext });
      return prepareParamsWithResolvedExecEnv(params, { hookContext: context.hookContext });
    },
    finalizeBeforeToolCallParams: (params, preparedParams) => {
      const envState = getResolvedExecEnvPreparedState(preparedParams);
      const deferredEnvState = getDeferredResolveExecEnvPreparedState(preparedParams);
      const workdirState = getResolvedExecWorkdirPreparedState(preparedParams);
      if (!envState && !deferredEnvState && !workdirState) return params;
      if (!isExecToolArgsObject(params)) return params;
      const execParams = params;
      let host;
      const resolveFinalHost = () => {
        host ??= resolveHostForParams(execParams);
        return host;
      };
      try {
        if (envState?.host && execParams.command && resolveFinalHost() !== envState.host)
          return { ...execParams };
        if (
          workdirState &&
          (resolveFinalHost() !== workdirState.host ||
            execParams.workdir !== workdirState.inputWorkdir)
        )
          return { ...execParams };
      } catch {
        return { ...execParams };
      }
      if (envState) markResolveExecEnvPrepared(execParams, envState);
      if (deferredEnvState) markDeferredResolveExecEnvPrepared(execParams, deferredEnvState);
      if (workdirState) markResolvedExecWorkdirPrepared(execParams, workdirState);
      return execParams;
    },
    execute: async (_toolCallId, args, signal, onUpdate) => {
      signal?.throwIfAborted();
      let params = stripMalformedXmlArgValueSuffixFromKeys(args, XML_ARG_VALUE_EXEC_PARAM_KEYS);
      const resolveExecEnvPrepared = isResolveExecEnvPrepared(args);
      const deferredResolveExecEnvState = getDeferredResolveExecEnvPreparedState(params);
      const preparedWorkdirState = getResolvedExecWorkdirPreparedState(params);
      const maxOutput = DEFAULT_MAX_OUTPUT;
      const pendingMaxOutput = DEFAULT_PENDING_MAX_OUTPUT;
      const warnings = [];
      const getWarningText = () => (warnings.length ? `${warnings.join("\n")}\n\n` : "");
      const approvalWarningText = normalizeOptionalString(defaults?.approvalWarningText);
      if (approvalWarningText) warnings.push(approvalWarningText);
      const startedAt = Date.now();
      let execCommandOverride;
      const backgroundRequested = params.background === true;
      const yieldRequested = typeof params.yieldMs === "number";
      const foregroundFallbackWarning =
        !allowBackground && (backgroundRequested || yieldRequested)
          ? "Warning: background execution is disabled; running synchronously."
          : void 0;
      const yieldWindow = allowBackground
        ? backgroundRequested
          ? 0
          : clampWithDefault(params.yieldMs ?? defaultBackgroundMs, defaultBackgroundMs, 10, 12e4)
        : null;
      const elevatedDefaults = defaults?.elevated;
      const elevatedAllowed = Boolean(elevatedDefaults?.enabled && elevatedDefaults.allowed);
      const elevatedDefaultMode =
        elevatedDefaults?.defaultLevel === "full"
          ? "full"
          : elevatedDefaults?.defaultLevel === "ask"
            ? "ask"
            : elevatedDefaults?.defaultLevel === "on"
              ? "ask"
              : "off";
      const effectiveDefaultMode = elevatedAllowed ? elevatedDefaultMode : "off";
      const elevatedMode =
        typeof params.elevated === "boolean"
          ? params.elevated
            ? elevatedDefaultMode === "full"
              ? "full"
              : "ask"
            : "off"
          : effectiveDefaultMode;
      const elevatedRequested = elevatedMode !== "off";
      if (elevatedRequested) {
        if (!elevatedDefaults?.enabled || !elevatedDefaults.allowed)
          throw new Error("elevated unavailable");
      }
      const requestedTarget = requireValidExecTarget(params.host);
      const target = resolveExecTarget({
        configuredTarget: defaults?.host,
        requestedTarget,
        elevatedRequested,
        sandboxAvailable: Boolean(defaults?.sandbox),
      });
      const host = target.effectiveHost;
      const explicitSecurity = defaults?.security;
      const configuredSecurity = explicitSecurity ?? (host === "sandbox" ? "deny" : "full");
      const modePolicy = resolveExecModePolicy({
        mode: defaults?.mode,
        security: configuredSecurity,
        ask: defaults?.ask ?? "off",
      });
      const approvalPolicy =
        host === "sandbox"
          ? void 0
          : resolveExecApprovalsFromFile({
              file: loadExecApprovals(),
              agentId,
              overrides: {
                security: "full",
                ask: "off",
              },
            }).agent;
      let security = minSecurity(
        modePolicy.security,
        approvalPolicy?.security ?? modePolicy.security,
      );
      if (
        security === "deny" &&
        (host !== "sandbox" || defaults?.mode === "deny" || explicitSecurity === "deny")
      )
        throw new Error(`exec denied: host=${host} security=deny`);
      const hostPolicyAllowsFullBypass =
        (approvalPolicy?.security ?? "full") === "full" && (approvalPolicy?.ask ?? "off") === "off";
      const modePolicyAllowsFullBypass = modePolicy.security === "full" && modePolicy.ask === "off";
      if (
        elevatedRequested &&
        elevatedMode === "full" &&
        modePolicyAllowsFullBypass &&
        hostPolicyAllowsFullBypass
      )
        security = "full";
      const requestedAsk = normalizeExecAsk(params.ask);
      const hostAsk = maxAsk(modePolicy.ask, approvalPolicy?.ask ?? modePolicy.ask);
      let ask = maxAsk(
        hostAsk,
        (defaults?.messageProvider && hostAsk === "off" ? void 0 : requestedAsk) ?? hostAsk,
      );
      const bypassApprovals =
        elevatedRequested &&
        elevatedMode === "full" &&
        modePolicyAllowsFullBypass &&
        hostPolicyAllowsFullBypass;
      if (bypassApprovals) ask = "off";
      const autoReview = modePolicy.autoReview && ask === modePolicy.ask && !bypassApprovals;
      const sandbox = host === "sandbox" ? defaults?.sandbox : void 0;
      if (target.selectedTarget === "sandbox" && !sandbox)
        throw new Error(
          [
            "exec host=sandbox requires a sandbox runtime for this session.",
            'Enable sandbox mode (`agents.defaults.sandbox.mode="non-main"` or `"all"`) or use host=auto/gateway/node.',
          ].join("\n"),
        );
      if (!params.command) throw new Error("Provide a command to start.");
      await rejectUnsafeExecControlShellCommand(params.command);
      let workdir;
      let scriptPreflightCwd = null;
      let containerWorkdir = sandbox?.containerWorkdir;
      let discardPreparedSandboxWorkdir = null;
      const workdirResolution =
        preparedWorkdirState?.host === host
          ? preparedWorkdirState.resolution
          : await resolveExecWorkdir({
              host,
              workdir: params.workdir,
              defaultCwd: defaults?.cwd,
              nodeCwd: defaults?.nodeCwd,
              sandbox,
            });
      if (workdirResolution.kind === "unavailable")
        return buildUnavailableWorkdirResult({
          cwd: workdirResolution.requestedCwd,
          startedAt,
          warningText: warnings.join("\n"),
        });
      if (workdirResolution.kind === "sandbox") {
        workdir = workdirResolution.hostCwd;
        containerWorkdir = workdirResolution.containerCwd;
        scriptPreflightCwd = workdirResolution.scriptPreflightCwd;
        if (sandbox?.discardPreparedWorkdir && sandbox.workdirValidation === "backend") {
          const preparedContainerWorkdir = containerWorkdir;
          discardPreparedSandboxWorkdir = () => {
            sandbox.discardPreparedWorkdir?.(preparedContainerWorkdir);
          };
        }
      } else if (workdirResolution.kind === "local") {
        workdir = workdirResolution.hostCwd;
        scriptPreflightCwd = workdirResolution.hostCwd;
      } else workdir = workdirResolution.remoteCwd;
      let run;
      let effectiveTimeout;
      try {
        if (elevatedRequested)
          logInfo(`exec: elevated command ${truncateMiddle(params.command, 120)}`);
        if (!resolveExecEnvPrepared)
          params = await prepareParamsWithResolvedExecEnv(params, {
            hookContext: deferredResolveExecEnvState?.hookContext,
          });
        const inheritedBaseEnv = coerceEnv(process.env);
        const resolvedExecEnvState = getResolvedExecEnvPreparedState(params);
        const channelContextEnv = buildChannelContextEnv(defaults?.channelContext);
        const requestedEnv =
          params.env !== void 0 ||
          resolvedExecEnvState?.pluginEnv !== void 0 ||
          channelContextEnv !== void 0
            ? {
                ...params.env,
                ...resolvedExecEnvState?.pluginEnv,
                ...channelContextEnv,
              }
            : void 0;
        const hostEnvResult =
          host === "sandbox"
            ? null
            : sanitizeHostExecEnvWithDiagnostics({
                baseEnv: inheritedBaseEnv,
                overrides: requestedEnv,
                blockPathOverrides: true,
              });
        if (
          hostEnvResult &&
          requestedEnv &&
          (hostEnvResult.rejectedOverrideBlockedKeys.length > 0 ||
            hostEnvResult.rejectedOverrideInvalidKeys.length > 0)
        ) {
          const blockedKeys = hostEnvResult.rejectedOverrideBlockedKeys;
          const invalidKeys = hostEnvResult.rejectedOverrideInvalidKeys;
          const pathBlocked = blockedKeys.includes("PATH");
          if (pathBlocked && blockedKeys.length === 1 && invalidKeys.length === 0)
            throw new Error(
              "Security Violation: Custom 'PATH' variable is forbidden during host execution.",
            );
          if (blockedKeys.length === 1 && invalidKeys.length === 0)
            throw new Error(
              `Security Violation: Environment variable '${blockedKeys[0]}' is forbidden during host execution.`,
            );
          const details = [];
          if (blockedKeys.length > 0)
            details.push(`blocked override keys: ${blockedKeys.join(", ")}`);
          if (invalidKeys.length > 0)
            details.push(`invalid non-portable override keys: ${invalidKeys.join(", ")}`);
          const suffix = details.join("; ");
          if (pathBlocked)
            throw new Error(
              `Security Violation: Custom 'PATH' variable is forbidden during host execution (${suffix}).`,
            );
          throw new Error(`Security Violation: ${suffix}.`);
        }
        const env =
          sandbox && host === "sandbox"
            ? buildSandboxEnv({
                defaultPath: DEFAULT_PATH,
                paramsEnv: requestedEnv,
                sandboxEnv: sandbox.env,
                containerWorkdir: containerWorkdir ?? sandbox.containerWorkdir,
              })
            : (hostEnvResult?.env ?? inheritedBaseEnv);
        if (!sandbox && host === "gateway" && !requestedEnv?.PATH)
          applyShellPath(
            env,
            getShellPathFromLoginShell({
              env: process.env,
              timeoutMs: resolveShellEnvFallbackTimeoutMs(process.env),
            }),
          );
        if (host === "node" && defaultPathPrepend.length > 0)
          warnings.push(
            "Warning: tools.exec.pathPrepend is ignored for host=node. Configure PATH on the node host/service instead.",
          );
        else applyPathPrepend(env, defaultPathPrepend);
        if (host === "node")
          return executeNodeHostCommand({
            command: params.command,
            workdir,
            env,
            requestedEnv,
            requestedNode: params.node?.trim(),
            boundNode: defaults?.node?.trim(),
            sessionKey: defaults?.sessionKey,
            sessionId: defaults?.sessionId,
            sessionStore: defaults?.sessionStore,
            bashElevated: elevatedDefaults,
            approvalReviewerDeviceId: defaults?.approvalReviewerDeviceId,
            turnSourceChannel: defaults?.messageProvider,
            turnSourceTo: defaults?.currentChannelId,
            turnSourceAccountId: defaults?.accountId,
            turnSourceThreadId: defaults?.currentThreadTs,
            agentId,
            security,
            ask,
            autoReview,
            autoReviewer,
            signal,
            strictInlineEval: defaults?.strictInlineEval,
            commandHighlighting: defaults?.commandHighlighting,
            trigger: defaults?.trigger,
            timeoutSec: params.timeout,
            defaultTimeoutSec,
            approvalRunningNoticeMs,
            warnings,
            foregroundWarnings: foregroundFallbackWarning ? [foregroundFallbackWarning] : [],
            notifySessionKey,
            notifyOnExit,
            trustedSafeBinDirs,
          });
        if (!workdir)
          throw new Error("exec internal error: local execution requires a resolved workdir");
        if (host === "gateway" && !bypassApprovals) {
          const gatewayResult = await processGatewayAllowlist({
            command: params.command,
            workdir,
            env,
            pathPrepend: defaultPathPrepend,
            requestedEnv,
            pty: params.pty === true && !sandbox,
            timeoutSec: params.timeout,
            defaultTimeoutSec,
            security,
            ask,
            autoReview,
            autoReviewer,
            signal,
            safeBins,
            safeBinProfiles,
            strictInlineEval: defaults?.strictInlineEval,
            commandHighlighting: defaults?.commandHighlighting,
            trigger: defaults?.trigger,
            agentId,
            sessionKey: defaults?.sessionKey,
            sessionId: defaults?.sessionId,
            sessionStore: defaults?.sessionStore,
            bashElevated: elevatedDefaults,
            approvalReviewerDeviceId: defaults?.approvalReviewerDeviceId,
            turnSourceChannel: defaults?.messageProvider,
            turnSourceTo: defaults?.currentChannelId,
            turnSourceAccountId: defaults?.accountId,
            turnSourceThreadId: defaults?.currentThreadTs,
            scopeKey: defaults?.scopeKey,
            approvalFollowupText: defaults?.approvalFollowupText,
            approvalFollowup: defaults?.approvalFollowup,
            approvalFollowupMode: defaults?.approvalFollowupMode,
            warnings,
            notifySessionKey,
            approvalRunningNoticeMs,
            maxOutput,
            pendingMaxOutput,
            trustedSafeBinDirs,
          });
          if (gatewayResult.pendingResult) return gatewayResult.pendingResult;
          if (gatewayResult.deniedResult) return gatewayResult.deniedResult;
          signal?.throwIfAborted();
          execCommandOverride = gatewayResult.execCommandOverride;
          if (gatewayResult.allowWithoutEnforcedCommand) execCommandOverride = void 0;
        }
        if (foregroundFallbackWarning) warnings.push(foregroundFallbackWarning);
        effectiveTimeout =
          (typeof params.timeout === "number" ? params.timeout : null) ?? defaultTimeoutSec;
        const usePty = params.pty === true && !sandbox;
        if (
          scriptPreflightCwd &&
          !shouldSkipExecScriptPreflight({
            host,
            security,
            ask,
          })
        )
          await validateScriptFileForShellBleed({
            command: params.command,
            workdir: scriptPreflightCwd,
          });
        signal?.throwIfAborted();
        run = await runExecProcess({
          command: params.command,
          execCommand: execCommandOverride,
          workdir,
          env,
          pathPrepend: defaultPathPrepend,
          sandbox,
          containerWorkdir,
          usePty,
          warnings,
          maxOutput,
          pendingMaxOutput,
          notifyOnExit,
          notifyOnExitEmptySuccess,
          scopeKey: defaults?.scopeKey,
          sessionKey: notifySessionKey,
          mainKey: defaults?.mainKey,
          sessionScope: defaults?.sessionScope,
          eventRouting: defaults?.eventRouting,
          notifyDeliveryContext,
          timeoutSec: effectiveTimeout,
          onUpdate,
        });
        discardPreparedSandboxWorkdir = null;
      } catch (error) {
        discardPreparedSandboxWorkdir?.();
        throw error;
      }
      let yielded = false;
      let yieldTimer = null;
      let registeredAbortSignal = null;
      const onAbortSignal = () => {
        run.disableUpdates();
        if (yielded || run.session.backgrounded) return;
        run.kill();
      };
      const cleanupToolRunListeners = () => {
        if (registeredAbortSignal) {
          registeredAbortSignal.removeEventListener("abort", onAbortSignal);
          registeredAbortSignal = null;
        }
        if (yieldTimer) {
          clearTimeout(yieldTimer);
          yieldTimer = null;
        }
      };
      if (signal?.aborted) onAbortSignal();
      else if (signal) {
        signal.addEventListener("abort", onAbortSignal, { once: true });
        registeredAbortSignal = signal;
      }
      return new Promise((resolve, reject) => {
        const resolveRunning = () => {
          cleanupToolRunListeners();
          resolve({
            content: [
              {
                type: "text",
                text: `${getWarningText()}Command still running (session ${run.session.id}, pid ${run.session.pid ?? "n/a"}). Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.`,
              },
            ],
            details: {
              status: "running",
              sessionId: run.session.id,
              pid: run.session.pid ?? void 0,
              startedAt: run.startedAt,
              cwd: run.session.cwd,
              tail: run.session.tail,
            },
          });
        };
        const onYieldNow = () => {
          if (yielded) return;
          yielded = true;
          markBackgrounded(run.session);
          resolveRunning();
        };
        if (allowBackground && yieldWindow !== null)
          if (yieldWindow === 0) onYieldNow();
          else
            yieldTimer = setTimeout(() => {
              if (yielded) return;
              yielded = true;
              markBackgrounded(run.session);
              resolveRunning();
            }, yieldWindow);
        run.promise
          .then((outcome) => {
            cleanupToolRunListeners();
            if (yielded || run.session.backgrounded) return;
            resolve(
              buildExecForegroundResult({
                outcome,
                cwd: run.session.cwd,
                warningText: getWarningText(),
              }),
            );
          })
          .catch((err) => {
            cleanupToolRunListeners();
            if (yielded || run.session.backgrounded) return;
            reject(err);
          });
      });
    },
  };
}
/** Default exec tool instance used by agent tool registries. */
const execTool = createExecTool();
//#endregion
//#region src/agents/pty-keys.ts
/**
 * Encodes terminal key, hex, literal, and paste inputs into PTY byte
 * sequences. The encoder handles xterm modifiers and DECCKM application
 * cursor mode.
 */
const ESC = "\x1B";
const CR = "\r";
const TAB = "	";
const BACKSPACE = "";
/** Bracketed-paste prefix emitted before pasted text. */
const BRACKETED_PASTE_START = `${ESC}[200~`;
/** Bracketed-paste suffix emitted after pasted text. */
const BRACKETED_PASTE_END = `${ESC}[201~`;
/** SS3 sequences for DECCKM application cursor key mode (smkx). */
const DECCKM_SS3_KEYS = {
  up: `${ESC}OA`,
  down: `${ESC}OB`,
  right: `${ESC}OC`,
  left: `${ESC}OD`,
  home: `${ESC}OH`,
  end: `${ESC}OF`,
};
const namedKeyMap = /* @__PURE__ */ new Map([
  ["enter", CR],
  ["return", CR],
  ["tab", TAB],
  ["escape", ESC],
  ["esc", ESC],
  ["space", " "],
  ["bspace", BACKSPACE],
  ["backspace", BACKSPACE],
  ["up", `${ESC}[A`],
  ["down", `${ESC}[B`],
  ["right", `${ESC}[C`],
  ["left", `${ESC}[D`],
  ["home", `${ESC}[1~`],
  ["end", `${ESC}[4~`],
  ["pageup", `${ESC}[5~`],
  ["pgup", `${ESC}[5~`],
  ["ppage", `${ESC}[5~`],
  ["pagedown", `${ESC}[6~`],
  ["pgdn", `${ESC}[6~`],
  ["npage", `${ESC}[6~`],
  ["insert", `${ESC}[2~`],
  ["ic", `${ESC}[2~`],
  ["delete", `${ESC}[3~`],
  ["del", `${ESC}[3~`],
  ["dc", `${ESC}[3~`],
  ["btab", `${ESC}[Z`],
  ["f1", `${ESC}OP`],
  ["f2", `${ESC}OQ`],
  ["f3", `${ESC}OR`],
  ["f4", `${ESC}OS`],
  ["f5", `${ESC}[15~`],
  ["f6", `${ESC}[17~`],
  ["f7", `${ESC}[18~`],
  ["f8", `${ESC}[19~`],
  ["f9", `${ESC}[20~`],
  ["f10", `${ESC}[21~`],
  ["f11", `${ESC}[23~`],
  ["f12", `${ESC}[24~`],
  ["kp/", `${ESC}Oo`],
  ["kp*", `${ESC}Oj`],
  ["kp-", `${ESC}Om`],
  ["kp+", `${ESC}Ok`],
  ["kp7", `${ESC}Ow`],
  ["kp8", `${ESC}Ox`],
  ["kp9", `${ESC}Oy`],
  ["kp4", `${ESC}Ot`],
  ["kp5", `${ESC}Ou`],
  ["kp6", `${ESC}Ov`],
  ["kp1", `${ESC}Oq`],
  ["kp2", `${ESC}Or`],
  ["kp3", `${ESC}Os`],
  ["kp0", `${ESC}Op`],
  ["kp.", `${ESC}On`],
  ["kpenter", `${ESC}OM`],
]);
const modifiableNamedKeys = /* @__PURE__ */ new Set([
  "up",
  "down",
  "left",
  "right",
  "home",
  "end",
  "pageup",
  "pgup",
  "ppage",
  "pagedown",
  "pgdn",
  "npage",
  "insert",
  "ic",
  "delete",
  "del",
  "dc",
]);
/** True when request keys depend on normal vs application cursor-key mode. */
function hasCursorModeSensitiveKeys(request) {
  return (
    request.keys?.some((raw) => {
      const token = raw.trim();
      if (!token) return false;
      const parsed = parseModifiers(token);
      if (hasAnyModifier(parsed.mods)) return false;
      return normalizeLowercaseStringOrEmpty(parsed.base) in DECCKM_SS3_KEYS;
    }) ?? false
  );
}
/** Encodes literal, hex, and named key tokens into one PTY input string. */
function encodeKeySequence(request, cursorKeyMode) {
  const warnings = [];
  let data = "";
  if (request.literal) data += request.literal;
  if (request.hex?.length)
    for (const raw of request.hex) {
      const byte = parseHexByte(raw);
      if (byte === null) {
        warnings.push(`Invalid hex byte: ${raw}`);
        continue;
      }
      data += String.fromCharCode(byte);
    }
  if (request.keys?.length)
    for (const token of request.keys) data += encodeKeyToken(token, warnings, cursorKeyMode);
  return {
    data,
    warnings,
  };
}
/** Wraps pasted text in bracketed-paste markers when enabled. */
function encodePaste(text, bracketed = true) {
  if (!bracketed) return text;
  return `${BRACKETED_PASTE_START}${text}${BRACKETED_PASTE_END}`;
}
function encodeKeyToken(raw, warnings, cursorKeyMode) {
  const token = raw.trim();
  if (!token) return "";
  if (token.length === 2 && token.startsWith("^")) {
    const ctrl = toCtrlChar(token.charAt(1));
    if (ctrl) return ctrl;
  }
  const parsed = parseModifiers(token);
  const base = parsed.base;
  const baseLower = normalizeLowercaseStringOrEmpty(base);
  if (baseLower === "tab" && parsed.mods.shift) return `${ESC}[Z`;
  if (
    modifiableNamedKeys.has(baseLower) &&
    cursorKeyMode === "application" &&
    !hasAnyModifier(parsed.mods)
  ) {
    const ss3Seq = DECCKM_SS3_KEYS[baseLower];
    if (ss3Seq) return ss3Seq;
  }
  const baseSeq = namedKeyMap.get(baseLower);
  if (baseSeq) {
    let seq = baseSeq;
    if (modifiableNamedKeys.has(baseLower) && hasAnyModifier(parsed.mods)) {
      const mod = xtermModifier(parsed.mods);
      if (mod > 1) {
        const modified = applyXtermModifier(seq, mod);
        if (modified) {
          seq = modified;
          return seq;
        }
      }
    }
    if (parsed.mods.alt) return `${ESC}${seq}`;
    return seq;
  }
  if (base.length === 1) return applyCharModifiers(base, parsed.mods);
  if (parsed.hasModifiers) warnings.push(`Unknown key "${base}" for modifiers; sending literal.`);
  return base;
}
function parseModifiers(token) {
  const mods = {
    ctrl: false,
    alt: false,
    shift: false,
  };
  let rest = token;
  let sawModifiers = false;
  while (rest.length > 2 && rest[1] === "-") {
    const mod = normalizeLowercaseStringOrEmpty(rest[0]);
    if (mod === "c") mods.ctrl = true;
    else if (mod === "m") mods.alt = true;
    else if (mod === "s") mods.shift = true;
    else break;
    sawModifiers = true;
    rest = rest.slice(2);
  }
  return {
    mods,
    base: rest,
    hasModifiers: sawModifiers,
  };
}
function applyCharModifiers(char, mods) {
  let value = char;
  if (mods.shift && value.length === 1 && /[a-z]/.test(value)) value = value.toUpperCase();
  if (mods.ctrl) {
    const ctrl = toCtrlChar(value);
    if (ctrl) value = ctrl;
  }
  if (mods.alt) value = `${ESC}${value}`;
  return value;
}
function toCtrlChar(char) {
  if (char.length !== 1) return null;
  if (char === "?") return "";
  const code = char.toUpperCase().charCodeAt(0);
  if (code >= 64 && code <= 95) return String.fromCharCode(code & 31);
  return null;
}
function xtermModifier(mods) {
  let mod = 1;
  if (mods.shift) mod += 1;
  if (mods.alt) mod += 2;
  if (mods.ctrl) mod += 4;
  return mod;
}
function applyXtermModifier(sequence, modifier) {
  const escPattern = escapeRegExp(ESC);
  const csiNumber = new RegExp(`^${escPattern}\\[(\\d+)([~A-Z])$`);
  const csiArrow = new RegExp(`^${escPattern}\\[(A|B|C|D|H|F)$`);
  const numberMatch = sequence.match(csiNumber);
  if (numberMatch) return `${ESC}[${numberMatch[1]};${modifier}${numberMatch[2]}`;
  const arrowMatch = sequence.match(csiArrow);
  if (arrowMatch) return `${ESC}[1;${modifier}${arrowMatch[1]}`;
  return null;
}
function hasAnyModifier(mods) {
  return mods.ctrl || mods.alt || mods.shift;
}
function parseHexByte(raw) {
  const lower = normalizeLowercaseStringOrEmpty(raw);
  const normalized = lower.startsWith("0x") ? lower.slice(2) : lower;
  if (!/^[0-9a-f]{1,2}$/.test(normalized)) return null;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value) || value < 0 || value > 255) return null;
  return value;
}
//#endregion
//#region src/agents/bash-tools.process-send-keys.ts
function failText$1(text) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
    details: { status: "failed" },
  };
}
async function writeProcessStdin(stdin, data) {
  await new Promise((resolve, reject) => {
    stdin.write(data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
/** Encode and write requested key data into a running process session. */
async function handleProcessSendKeys(params) {
  const request = {
    keys: params.keys,
    hex: params.hex,
    literal: params.literal,
  };
  if (params.session.cursorKeyMode === "unknown" && hasCursorModeSensitiveKeys(request))
    return failText$1(
      `Session ${params.sessionId} cursor key mode is not known yet. Poll or log until startup output appears, then retry send-keys.`,
    );
  const { data, warnings } = encodeKeySequence(
    request,
    params.session.cursorKeyMode === "unknown" ? void 0 : params.session.cursorKeyMode,
  );
  if (!data) return failText$1("No key data provided.");
  await writeProcessStdin(params.stdin, data);
  return {
    content: [
      {
        type: "text",
        text:
          `Sent ${data.length} bytes to session ${params.sessionId}.` +
          (warnings.length ? `\nWarnings:\n- ${warnings.join("\n- ")}` : ""),
      },
    ],
    details: {
      status: "running",
      sessionId: params.sessionId,
      name: deriveSessionName(params.session.command),
    },
  };
}
//#endregion
//#region src/agents/bash-tools.process.ts
/**
 * Process-control tool factory.
 * Lists, polls, logs, writes to, sends keys to, pastes into, kills, clears,
 * and removes background exec sessions.
 */
const DEFAULT_LOG_TAIL_LINES = 200;
const DEFAULT_INPUT_WAIT_IDLE_MS = 15e3;
const MIN_INPUT_WAIT_IDLE_MS = 1e3;
const MAX_INPUT_WAIT_IDLE_MS = 600 * 1e3;
function resolveLogSliceWindow(offset, limit) {
  const usingDefaultTail = offset === void 0 && limit === void 0;
  return {
    effectiveOffset: offset,
    effectiveLimit:
      typeof limit === "number" && Number.isFinite(limit)
        ? limit
        : usingDefaultTail
          ? DEFAULT_LOG_TAIL_LINES
          : void 0,
    usingDefaultTail,
  };
}
function defaultTailNote(totalLines, usingDefaultTail) {
  if (!usingDefaultTail || totalLines <= DEFAULT_LOG_TAIL_LINES) return "";
  return `\n\n[showing last ${DEFAULT_LOG_TAIL_LINES} of ${totalLines} lines; pass offset/limit to page]`;
}
const MAX_POLL_WAIT_MS = 3e4;
function resolveSessionStdin(session) {
  return session.stdin ?? session.child?.stdin;
}
function isWritableStdin(stdin) {
  if (!stdin || stdin.destroyed) return false;
  if (stdin.writable === false || stdin.writableEnded === true || stdin.writableFinished === true)
    return false;
  return true;
}
function runningSessionInputDetails(runtime) {
  return {
    stdinWritable: runtime.stdinWritable,
    waitingForInput: runtime.waitingForInput,
    idleMs: runtime.idleMs,
    lastOutputAt: runtime.lastOutputAt,
  };
}
function resolvePollWaitMs(value) {
  if (typeof value === "number" && Number.isFinite(value))
    return Math.max(0, Math.min(MAX_POLL_WAIT_MS, Math.floor(value)));
  if (typeof value === "string" && /^[+-]?\d+$/.test(value.trim())) {
    const parsed = Number(value.trim());
    if (Number.isSafeInteger(parsed)) return Math.max(0, Math.min(MAX_POLL_WAIT_MS, parsed));
  }
  return 0;
}
function failText(text) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
    details: { status: "failed" },
  };
}
function recordPollRetrySuggestion(sessionId, hasNewOutput) {
  try {
    return recordCommandPoll(getDiagnosticSessionState({ sessionId }), sessionId, hasNewOutput);
  } catch {
    return;
  }
}
function resetPollRetrySuggestion(sessionId) {
  try {
    resetCommandPollCount(getDiagnosticSessionState({ sessionId }), sessionId);
  } catch {}
}
function createAbortError(reason) {
  if (reason instanceof Error) return reason;
  return createAbortError$1(typeof reason === "string" ? reason : "Aborted");
}
async function sleepPollInterval(ms, signal) {
  if (signal?.aborted) throw createAbortError(signal.reason);
  await new Promise((resolve, reject) => {
    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (onAbort) signal?.removeEventListener("abort", onAbort);
    };
    const onResolve = () => {
      cleanup();
      resolve();
    };
    const onAbort = () => {
      cleanup();
      reject(createAbortError(signal?.reason));
    };
    const timer = setTimeout(onResolve, ms);
    timer.unref?.();
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
/** Build the process-control tool with optional cleanup, scope, and input-idle defaults. */
function createProcessTool(defaults) {
  if (defaults?.cleanupMs !== void 0) setJobTtlMs(defaults.cleanupMs);
  const scopeKey = defaults?.scopeKey;
  const supervisor = getProcessSupervisor();
  const inputWaitIdleMs = clampWithDefault(
    defaults?.inputWaitIdleMs ?? readEnvInt("OPENCLAW_PROCESS_INPUT_WAIT_IDLE_MS"),
    DEFAULT_INPUT_WAIT_IDLE_MS,
    MIN_INPUT_WAIT_IDLE_MS,
    MAX_INPUT_WAIT_IDLE_MS,
  );
  const isInScope = (session) => !scopeKey || session?.scopeKey === scopeKey;
  const describeRunningSession = (session) => {
    const lastOutputAt = supervisor.getRecord(session.id)?.lastOutputAtMs ?? session.startedAt;
    const idleMs = Math.max(0, Date.now() - lastOutputAt);
    const stdinWritable = isWritableStdin(resolveSessionStdin(session));
    return {
      stdinWritable,
      waitingForInput: stdinWritable && idleMs >= inputWaitIdleMs,
      idleMs,
      lastOutputAt,
    };
  };
  const buildInputWaitHint = (runtime) => {
    if (!runtime?.waitingForInput) return "";
    return `\n\nNo new output for ${formatDurationCompact(runtime.idleMs) ?? `${runtime.idleMs}ms`}; this session may be waiting for input. Use process write, send-keys, submit, or paste to provide input.`;
  };
  const cancelManagedSession = (sessionId) => {
    const record = supervisor.getRecord(sessionId);
    if (!record || record.state === "exited") return false;
    supervisor.cancel(sessionId, "manual-cancel");
    return true;
  };
  const terminateSessionFallback = (session) => {
    const pid = session.pid ?? session.child?.pid;
    if (typeof pid !== "number" || !Number.isFinite(pid) || pid <= 0) return false;
    killProcessTree(pid);
    return true;
  };
  return {
    name: "process",
    label: "process",
    displaySummary: PROCESS_TOOL_DISPLAY_SUMMARY,
    description: describeProcessTool({ hasCronTool: defaults?.hasCronTool === true }),
    parameters: processSchema,
    execute: async (_toolCallId, args, signal, _onUpdate) => {
      const params = args;
      if (params.action === "list") {
        const running = listRunningSessions()
          .filter((s) => isInScope(s))
          .map((s) => {
            const runtime = describeRunningSession(s);
            return {
              sessionId: s.id,
              status: "running",
              pid: s.pid ?? void 0,
              startedAt: s.startedAt,
              runtimeMs: Date.now() - s.startedAt,
              cwd: s.cwd,
              command: s.command,
              name: deriveSessionName(s.command),
              tail: s.tail,
              truncated: s.truncated,
              stdinWritable: runtime.stdinWritable,
              waitingForInput: runtime.waitingForInput,
              idleMs: runtime.idleMs,
              lastOutputAt: runtime.lastOutputAt,
            };
          });
        const finished = listFinishedSessions()
          .filter((s) => isInScope(s))
          .map((s) => ({
            sessionId: s.id,
            status: s.status,
            startedAt: s.startedAt,
            endedAt: s.endedAt,
            runtimeMs: s.endedAt - s.startedAt,
            cwd: s.cwd,
            command: s.command,
            name: deriveSessionName(s.command),
            tail: s.tail,
            truncated: s.truncated,
            exitCode: s.exitCode ?? void 0,
            exitSignal: s.exitSignal ?? void 0,
          }));
        return {
          content: [
            {
              type: "text",
              text:
                [...running, ...finished]
                  .toSorted((a, b) => b.startedAt - a.startedAt)
                  .map((s) => {
                    const label = s.name
                      ? truncateMiddle(s.name, 80)
                      : truncateMiddle(s.command, 120);
                    const marker =
                      "waitingForInput" in s && s.waitingForInput ? " [input-wait]" : "";
                    return `${s.sessionId} ${pad(s.status, 9)} ${formatDurationCompact(s.runtimeMs) ?? "n/a"}${marker} :: ${label}`;
                  })
                  .join("\n") || "No running or recent sessions.",
            },
          ],
          details: {
            status: "completed",
            sessions: [...running, ...finished],
          },
        };
      }
      if (!params.sessionId)
        return {
          content: [
            {
              type: "text",
              text: "sessionId is required for this action.",
            },
          ],
          details: { status: "failed" },
        };
      const session = getSession(params.sessionId);
      const finished = getFinishedSession(params.sessionId);
      const scopedSession = isInScope(session) ? session : void 0;
      const scopedFinished = isInScope(finished) ? finished : void 0;
      const failedResult = (text) => ({
        content: [
          {
            type: "text",
            text,
          },
        ],
        details: { status: "failed" },
      });
      const resolveBackgroundedWritableStdin = () => {
        if (!scopedSession)
          return {
            ok: false,
            result: failedResult(`No active session found for ${params.sessionId}`),
          };
        if (!scopedSession.backgrounded)
          return {
            ok: false,
            result: failedResult(`Session ${params.sessionId} is not backgrounded.`),
          };
        if (scopedSession.finalizing)
          return {
            ok: false,
            result: failedResult(`Session ${params.sessionId} is finalizing.`),
          };
        const stdin = resolveSessionStdin(scopedSession);
        if (!isWritableStdin(stdin))
          return {
            ok: false,
            result: failedResult(`Session ${params.sessionId} stdin is not writable.`),
          };
        return {
          ok: true,
          session: scopedSession,
          stdin,
        };
      };
      const runningSessionResult = (sessionLocal, text) => ({
        content: [
          {
            type: "text",
            text,
          },
        ],
        details: {
          status: "running",
          sessionId: params.sessionId,
          name: deriveSessionName(sessionLocal.command),
        },
      });
      switch (params.action) {
        case "poll": {
          if (!scopedSession) {
            if (scopedFinished) {
              resetPollRetrySuggestion(params.sessionId);
              return {
                content: [
                  {
                    type: "text",
                    text:
                      (scopedFinished.tail ||
                        `(no output recorded${scopedFinished.truncated ? " — truncated to cap" : ""})`) +
                      `\n\nProcess exited with ${scopedFinished.exitSignal ? `signal ${scopedFinished.exitSignal}` : `code ${scopedFinished.exitCode ?? 0}`}.`,
                  },
                ],
                details: {
                  status: scopedFinished.status === "completed" ? "completed" : "failed",
                  sessionId: params.sessionId,
                  exitCode: scopedFinished.exitCode ?? void 0,
                  ...(scopedFinished.exitSignal != null
                    ? { exitSignal: scopedFinished.exitSignal }
                    : {}),
                  ...(scopedFinished.exitReason
                    ? {
                        exitReason: scopedFinished.exitReason,
                        timedOut:
                          scopedFinished.exitReason === "overall-timeout" ||
                          scopedFinished.exitReason === "no-output-timeout",
                      }
                    : {}),
                  ...(scopedFinished.noOutputTimedOut !== void 0
                    ? { noOutputTimedOut: scopedFinished.noOutputTimedOut }
                    : {}),
                  aggregated: scopedFinished.aggregated,
                  name: deriveSessionName(scopedFinished.command),
                },
              };
            }
            resetPollRetrySuggestion(params.sessionId);
            return failText(`No session found for ${params.sessionId}`);
          }
          if (!scopedSession.backgrounded)
            return failText(`Session ${params.sessionId} is not backgrounded.`);
          const pollWaitMs = resolvePollWaitMs(params.timeout);
          if (pollWaitMs > 0 && !scopedSession.exited) {
            const deadline = Date.now() + pollWaitMs;
            while (!scopedSession.exited && Date.now() < deadline)
              await sleepPollInterval(Math.max(0, Math.min(250, deadline - Date.now())), signal);
          }
          const { stdout, stderr } = drainSession(scopedSession);
          const exited = scopedSession.exited;
          const exitCode = scopedSession.exitCode ?? 0;
          const exitSignal = scopedSession.exitSignal ?? void 0;
          if (exited) {
            const status = exitCode === 0 && exitSignal == null ? "completed" : "failed";
            markExited(
              scopedSession,
              scopedSession.exitCode ?? null,
              scopedSession.exitSignal ?? null,
              status,
              scopedSession.exitReason,
              scopedSession.noOutputTimedOut,
            );
          }
          const status = exited
            ? exitCode === 0 && exitSignal == null
              ? "completed"
              : "failed"
            : "running";
          const output = [stdout.trimEnd(), stderr.trimEnd()].filter(Boolean).join("\n").trim();
          const hasNewOutput = output.length > 0;
          const retryInMs = exited
            ? void 0
            : recordPollRetrySuggestion(params.sessionId, hasNewOutput);
          if (exited) resetPollRetrySuggestion(params.sessionId);
          const runtime = exited ? void 0 : describeRunningSession(scopedSession);
          return {
            content: [
              {
                type: "text",
                text:
                  (output || "(no new output)") +
                  (exited
                    ? `\n\nProcess exited with ${exitSignal ? `signal ${exitSignal}` : `code ${exitCode}`}.`
                    : buildInputWaitHint(runtime) || "\n\nProcess still running."),
              },
            ],
            details: {
              status,
              sessionId: params.sessionId,
              exitCode: exited ? exitCode : void 0,
              ...(exited && scopedSession.exitSignal != null
                ? { exitSignal: scopedSession.exitSignal }
                : {}),
              ...(exited && scopedSession.exitReason
                ? {
                    exitReason: scopedSession.exitReason,
                    timedOut:
                      scopedSession.exitReason === "overall-timeout" ||
                      scopedSession.exitReason === "no-output-timeout",
                  }
                : {}),
              ...(exited && scopedSession.noOutputTimedOut !== void 0
                ? { noOutputTimedOut: scopedSession.noOutputTimedOut }
                : {}),
              aggregated: scopedSession.aggregated,
              name: deriveSessionName(scopedSession.command),
              ...(runtime ? runningSessionInputDetails(runtime) : {}),
              ...(typeof retryInMs === "number" ? { retryInMs } : {}),
            },
          };
        }
        case "log":
          if (scopedSession) {
            if (!scopedSession.backgrounded)
              return {
                content: [
                  {
                    type: "text",
                    text: `Session ${params.sessionId} is not backgrounded.`,
                  },
                ],
                details: { status: "failed" },
              };
            const window = resolveLogSliceWindow(params.offset, params.limit);
            const { slice, totalLines, totalChars } = sliceLogLines(
              scopedSession.aggregated,
              window.effectiveOffset,
              window.effectiveLimit,
            );
            const runtime = describeRunningSession(scopedSession);
            const logDefaultTailNote = defaultTailNote(totalLines, window.usingDefaultTail);
            return {
              content: [
                {
                  type: "text",
                  text:
                    (slice || "(no output yet)") + logDefaultTailNote + buildInputWaitHint(runtime),
                },
              ],
              details: {
                status: scopedSession.exited ? "completed" : "running",
                sessionId: params.sessionId,
                total: totalLines,
                totalLines,
                totalChars,
                truncated: scopedSession.truncated,
                name: deriveSessionName(scopedSession.command),
                ...runningSessionInputDetails(runtime),
              },
            };
          }
          if (scopedFinished) {
            const window = resolveLogSliceWindow(params.offset, params.limit);
            const { slice, totalLines, totalChars } = sliceLogLines(
              scopedFinished.aggregated,
              window.effectiveOffset,
              window.effectiveLimit,
            );
            const status = scopedFinished.status === "completed" ? "completed" : "failed";
            const logDefaultTailNote = defaultTailNote(totalLines, window.usingDefaultTail);
            return {
              content: [
                {
                  type: "text",
                  text: (slice || "(no output recorded)") + logDefaultTailNote,
                },
              ],
              details: {
                status,
                sessionId: params.sessionId,
                total: totalLines,
                totalLines,
                totalChars,
                truncated: scopedFinished.truncated,
                exitCode: scopedFinished.exitCode ?? void 0,
                exitSignal: scopedFinished.exitSignal ?? void 0,
                name: deriveSessionName(scopedFinished.command),
              },
            };
          }
          return {
            content: [
              {
                type: "text",
                text: `No session found for ${params.sessionId}`,
              },
            ],
            details: { status: "failed" },
          };
        case "write": {
          const resolved = resolveBackgroundedWritableStdin();
          if (!resolved.ok) return resolved.result;
          await writeProcessStdin(resolved.stdin, params.data ?? "");
          if (params.eof) resolved.stdin.end();
          return runningSessionResult(
            resolved.session,
            `Wrote ${(params.data ?? "").length} bytes to session ${params.sessionId}${params.eof ? " (stdin closed)" : ""}.`,
          );
        }
        case "send-keys": {
          const resolved = resolveBackgroundedWritableStdin();
          if (!resolved.ok) return resolved.result;
          return await handleProcessSendKeys({
            sessionId: params.sessionId,
            session: resolved.session,
            stdin: resolved.stdin,
            keys: params.keys,
            hex: params.hex,
            literal: params.literal,
          });
        }
        case "submit": {
          const resolved = resolveBackgroundedWritableStdin();
          if (!resolved.ok) return resolved.result;
          await writeProcessStdin(resolved.stdin, "\r");
          return runningSessionResult(
            resolved.session,
            `Submitted session ${params.sessionId} (sent CR).`,
          );
        }
        case "paste": {
          const resolved = resolveBackgroundedWritableStdin();
          if (!resolved.ok) return resolved.result;
          const payload = encodePaste(params.text ?? "", params.bracketed !== false);
          if (!payload)
            return {
              content: [
                {
                  type: "text",
                  text: "No paste text provided.",
                },
              ],
              details: { status: "failed" },
            };
          await writeProcessStdin(resolved.stdin, payload);
          return runningSessionResult(
            resolved.session,
            `Pasted ${params.text?.length ?? 0} chars to session ${params.sessionId}.`,
          );
        }
        case "kill": {
          if (!scopedSession) return failText(`No active session found for ${params.sessionId}`);
          if (!scopedSession.backgrounded)
            return failText(`Session ${params.sessionId} is not backgrounded.`);
          if (scopedSession.finalizing)
            return failText(`Session ${params.sessionId} is finalizing.`);
          const canceled = cancelManagedSession(scopedSession.id);
          if (!canceled) {
            if (!terminateSessionFallback(scopedSession))
              return failText(
                `Unable to terminate session ${params.sessionId}: no active supervisor run or process id.`,
              );
            markExited(scopedSession, null, "SIGKILL", "failed");
          }
          resetPollRetrySuggestion(params.sessionId);
          return {
            content: [
              {
                type: "text",
                text: canceled
                  ? `Termination requested for session ${params.sessionId}.`
                  : `Killed session ${params.sessionId}.`,
              },
            ],
            details: {
              status: "failed",
              name: scopedSession ? deriveSessionName(scopedSession.command) : void 0,
            },
          };
        }
        case "clear":
          if (scopedFinished) {
            resetPollRetrySuggestion(params.sessionId);
            deleteSession(params.sessionId);
            return {
              content: [
                {
                  type: "text",
                  text: `Cleared session ${params.sessionId}.`,
                },
              ],
              details: { status: "completed" },
            };
          }
          return {
            content: [
              {
                type: "text",
                text: `No finished session found for ${params.sessionId}`,
              },
            ],
            details: { status: "failed" },
          };
        case "remove":
          if (scopedSession) {
            if (scopedSession.finalizing)
              return failText(`Session ${params.sessionId} is finalizing.`);
            const canceled = cancelManagedSession(scopedSession.id);
            if (canceled) {
              scopedSession.backgrounded = false;
              deleteSession(params.sessionId);
            } else {
              if (!terminateSessionFallback(scopedSession))
                return failText(
                  `Unable to remove session ${params.sessionId}: no active supervisor run or process id.`,
                );
              markExited(scopedSession, null, "SIGKILL", "failed");
              deleteSession(params.sessionId);
            }
            resetPollRetrySuggestion(params.sessionId);
            return {
              content: [
                {
                  type: "text",
                  text: canceled
                    ? `Removed session ${params.sessionId} (termination requested).`
                    : `Removed session ${params.sessionId}.`,
                },
              ],
              details: {
                status: "failed",
                name: scopedSession ? deriveSessionName(scopedSession.command) : void 0,
              },
            };
          }
          if (scopedFinished) {
            resetPollRetrySuggestion(params.sessionId);
            deleteSession(params.sessionId);
            return {
              content: [
                {
                  type: "text",
                  text: `Removed session ${params.sessionId}.`,
                },
              ],
              details: { status: "completed" },
            };
          }
          return {
            content: [
              {
                type: "text",
                text: `No session found for ${params.sessionId}`,
              },
            ],
            details: { status: "failed" },
          };
      }
      return {
        content: [
          {
            type: "text",
            text: `Unknown action ${params.action}`,
          },
        ],
        details: { status: "failed" },
      };
    },
  };
}
/** Shared process-control tool instance used by the default Bash tool barrel. */
const processTool = createProcessTool();
//#endregion
export { execTool as i, processTool as n, createExecTool as r, createProcessTool as t };
