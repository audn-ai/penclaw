import { t as getAcpSessionManager } from "./manager-CU7-9RFR.js";
import {
  _ as validateRuntimeModelInput,
  g as validateRuntimeModeInput,
  h as validateRuntimeCwdInput,
  m as validateRuntimeConfigOptionInput,
  u as parseRuntimeTimeoutSecondsInput,
  y as validateRuntimePermissionProfileInput,
} from "./manager.turn-timeout-DXXvfPFH.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { r as resolveAcpSessionIdentifierLinesFromIdentity } from "./session-identifiers-BmbqiGBi.js";
import {
  C as stopWithText,
  _ as parseSingleValueCommandInput,
  a as ACP_PERMISSIONS_USAGE,
  c as ACP_SET_MODE_USAGE,
  g as parseSetCommandInput,
  h as parseOptionalSingleTarget,
  i as ACP_MODEL_USAGE,
  l as ACP_STATUS_USAGE,
  m as formatRuntimeOptionsText,
  o as ACP_RESET_OPTIONS_USAGE,
  p as formatAcpCapabilitiesText,
  t as ACP_CWD_USAGE,
  u as ACP_TIMEOUT_USAGE,
  w as withAcpCommandErrorBoundary,
} from "./shared-KqG9R6lH.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { t as resolveAcpTargetSessionKey } from "./targets-nOa_2yOU.js";
import { r as findLatestTaskForRelatedSessionKeyForOwner } from "./task-owner-access-CsO1Y--R.js";
import { a as sanitizeTaskStatusText } from "./task-status-DAPY5YOX.js";
//#region src/auto-reply/reply/commands-acp/runtime-options.ts
async function resolveTargetSessionKeyOrStop(params) {
  const target = await resolveAcpTargetSessionKey({
    commandParams: params.commandParams,
    token: params.token,
  });
  if (!target.ok) return stopWithText(`⚠️ ${target.error}`);
  return target.sessionKey;
}
async function resolveOptionalSingleTargetOrStop(params) {
  const parsed = parseOptionalSingleTarget(params.restTokens, params.usage);
  if (!parsed.ok) return stopWithText(`⚠️ ${parsed.error}`);
  return await resolveTargetSessionKeyOrStop({
    commandParams: params.commandParams,
    token: parsed.sessionToken,
  });
}
async function resolveSingleTargetValueOrStop(params) {
  const parsed = parseSingleValueCommandInput(params.restTokens, params.usage);
  if (!parsed.ok) return stopWithText(`⚠️ ${parsed.error}`);
  const targetSessionKey = await resolveTargetSessionKeyOrStop({
    commandParams: params.commandParams,
    token: parsed.value.sessionToken,
  });
  if (typeof targetSessionKey !== "string") return targetSessionKey;
  return {
    targetSessionKey,
    value: parsed.value.value,
  };
}
async function withSingleTargetValue(params) {
  const resolved = await resolveSingleTargetValueOrStop({
    commandParams: params.commandParams,
    restTokens: params.restTokens,
    usage: params.usage,
  });
  if (!("targetSessionKey" in resolved)) return resolved;
  return await params.run(resolved);
}
async function handleSingleRuntimeOptionAction(commandParams, restTokens, action) {
  return await withSingleTargetValue({
    commandParams,
    restTokens,
    usage: action.usage,
    run: async ({ targetSessionKey, value }) =>
      await withAcpCommandErrorBoundary({
        run: async () => {
          const parsedValue = action.parseValue(value);
          return {
            parsedValue,
            options: await action.update(targetSessionKey, parsedValue),
          };
        },
        fallbackCode: "ACP_TURN_FAILED",
        fallbackMessage: `Could not update ACP ${action.optionLabel}.`,
        onSuccess: ({ parsedValue, options }) => {
          const valueText = action.formatValue?.(parsedValue) ?? String(parsedValue);
          return stopWithText(
            `✅ Updated ACP ${action.optionLabel} for ${targetSessionKey}: ${valueText}. Effective options: ${formatRuntimeOptionsText(options)}`,
          );
        },
      }),
  });
}
async function handleAcpStatusAction(params, restTokens) {
  const targetSessionKey = await resolveOptionalSingleTargetOrStop({
    commandParams: params,
    restTokens,
    usage: ACP_STATUS_USAGE,
  });
  if (typeof targetSessionKey !== "string") return targetSessionKey;
  return await withAcpCommandErrorBoundary({
    run: async () =>
      await getAcpSessionManager().getSessionStatus({
        cfg: params.cfg,
        sessionKey: targetSessionKey,
      }),
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "Could not read ACP session status.",
    onSuccess: (status) => {
      const linkedTask = findLatestTaskForRelatedSessionKeyForOwner({
        relatedSessionKey: status.sessionKey,
        callerOwnerKey: params.sessionKey,
      });
      const sessionIdentifierLines = resolveAcpSessionIdentifierLinesFromIdentity({
        backend: status.backend,
        identity: status.identity,
      });
      const taskProgress = sanitizeTaskStatusText(linkedTask?.progressSummary);
      const taskSummary = sanitizeTaskStatusText(linkedTask?.terminalSummary, {
        errorContext: true,
      });
      const taskError = sanitizeTaskStatusText(linkedTask?.error, { errorContext: true });
      const lastError = sanitizeTaskStatusText(status.lastError, { errorContext: true });
      const runtimeSummary = sanitizeTaskStatusText(status.runtimeStatus?.summary, {
        errorContext: true,
      });
      const runtimeDetails = sanitizeTaskStatusText(status.runtimeStatus?.details, {
        errorContext: true,
      });
      const taskUpdatedAt =
        typeof linkedTask?.lastEventAt === "number"
          ? timestampMsToIsoString(linkedTask.lastEventAt)
          : void 0;
      const lastActivityAt = timestampMsToIsoString(status.lastActivityAt) ?? "n/a";
      return stopWithText(
        [
          "ACP status:",
          "-----",
          `session: ${status.sessionKey}`,
          `backend: ${status.backend}`,
          `agent: ${status.agent}`,
          ...sessionIdentifierLines,
          `sessionMode: ${status.mode}`,
          `state: ${status.state}`,
          ...(linkedTask
            ? [
                `taskId: ${linkedTask.taskId}`,
                `taskStatus: ${linkedTask.status}`,
                `delivery: ${linkedTask.deliveryStatus}`,
                ...(taskProgress ? [`taskProgress: ${taskProgress}`] : []),
                ...(taskSummary ? [`taskSummary: ${taskSummary}`] : []),
                ...(taskError ? [`taskError: ${taskError}`] : []),
                ...(taskUpdatedAt ? [`taskUpdatedAt: ${taskUpdatedAt}`] : []),
              ]
            : []),
          `runtimeOptions: ${formatRuntimeOptionsText(status.runtimeOptions)}`,
          `capabilities: ${formatAcpCapabilitiesText(status.capabilities.controls)}`,
          `lastActivityAt: ${lastActivityAt}`,
          ...(lastError ? [`lastError: ${lastError}`] : []),
          ...(runtimeSummary ? [`runtime: ${runtimeSummary}`] : []),
          ...(runtimeDetails ? [`runtimeDetails: ${runtimeDetails}`] : []),
        ].join("\n"),
      );
    },
  });
}
async function handleAcpSetModeAction(params, restTokens) {
  return await withSingleTargetValue({
    commandParams: params,
    restTokens,
    usage: ACP_SET_MODE_USAGE,
    run: async ({ targetSessionKey, value }) =>
      await withAcpCommandErrorBoundary({
        run: async () => {
          const runtimeMode = validateRuntimeModeInput(value);
          return {
            runtimeMode,
            options: await getAcpSessionManager().setSessionRuntimeMode({
              cfg: params.cfg,
              sessionKey: targetSessionKey,
              runtimeMode,
            }),
          };
        },
        fallbackCode: "ACP_TURN_FAILED",
        fallbackMessage: "Could not update ACP runtime mode.",
        onSuccess: ({ runtimeMode, options }) =>
          stopWithText(
            `✅ Updated ACP runtime mode for ${targetSessionKey}: ${runtimeMode}. Effective options: ${formatRuntimeOptionsText(options)}`,
          ),
      }),
  });
}
async function handleAcpSetAction(params, restTokens) {
  const parsed = parseSetCommandInput(restTokens);
  if (!parsed.ok) return stopWithText(`⚠️ ${parsed.error}`);
  const target = await resolveAcpTargetSessionKey({
    commandParams: params,
    token: parsed.value.sessionToken,
  });
  if (!target.ok) return stopWithText(`⚠️ ${target.error}`);
  const key = parsed.value.key.trim();
  const value = parsed.value.value.trim();
  return await withAcpCommandErrorBoundary({
    run: async () => {
      if (normalizeLowercaseStringOrEmpty(key) === "cwd") {
        const cwd = validateRuntimeCwdInput(value);
        const options = await getAcpSessionManager().updateSessionRuntimeOptions({
          cfg: params.cfg,
          sessionKey: target.sessionKey,
          patch: { cwd },
        });
        return {
          text: `✅ Updated ACP cwd for ${target.sessionKey}: ${cwd}. Effective options: ${formatRuntimeOptionsText(options)}`,
        };
      }
      const validated = validateRuntimeConfigOptionInput(key, value);
      const options = await getAcpSessionManager().setSessionConfigOption({
        cfg: params.cfg,
        sessionKey: target.sessionKey,
        key: validated.key,
        value: validated.value,
      });
      return {
        text: `✅ Updated ACP config option for ${target.sessionKey}: ${validated.key}=${validated.value}. Effective options: ${formatRuntimeOptionsText(options)}`,
      };
    },
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "Could not update ACP config option.",
    onSuccess: ({ text }) => stopWithText(text),
  });
}
async function handleAcpCwdAction(params, restTokens) {
  return await handleSingleRuntimeOptionAction(params, restTokens, {
    usage: ACP_CWD_USAGE,
    optionLabel: "cwd",
    parseValue: validateRuntimeCwdInput,
    update: async (targetSessionKey, value) =>
      await getAcpSessionManager().updateSessionRuntimeOptions({
        cfg: params.cfg,
        sessionKey: targetSessionKey,
        patch: { cwd: value },
      }),
  });
}
async function handleAcpPermissionsAction(params, restTokens) {
  return await handleSingleRuntimeOptionAction(params, restTokens, {
    usage: ACP_PERMISSIONS_USAGE,
    optionLabel: "permissions profile",
    parseValue: validateRuntimePermissionProfileInput,
    update: async (targetSessionKey, value) =>
      await getAcpSessionManager().setSessionConfigOption({
        cfg: params.cfg,
        sessionKey: targetSessionKey,
        key: "approval_policy",
        value,
      }),
  });
}
async function handleAcpTimeoutAction(params, restTokens) {
  return await handleSingleRuntimeOptionAction(params, restTokens, {
    usage: ACP_TIMEOUT_USAGE,
    optionLabel: "timeout",
    parseValue: parseRuntimeTimeoutSecondsInput,
    formatValue: (value) => `${value}s`,
    update: async (targetSessionKey, value) =>
      await getAcpSessionManager().setSessionConfigOption({
        cfg: params.cfg,
        sessionKey: targetSessionKey,
        key: "timeout",
        value: String(value),
      }),
  });
}
async function handleAcpModelAction(params, restTokens) {
  return await handleSingleRuntimeOptionAction(params, restTokens, {
    usage: ACP_MODEL_USAGE,
    optionLabel: "model",
    parseValue: validateRuntimeModelInput,
    update: async (targetSessionKey, value) =>
      await getAcpSessionManager().setSessionConfigOption({
        cfg: params.cfg,
        sessionKey: targetSessionKey,
        key: "model",
        value,
      }),
  });
}
async function handleAcpResetOptionsAction(params, restTokens) {
  const targetSessionKey = await resolveOptionalSingleTargetOrStop({
    commandParams: params,
    restTokens,
    usage: ACP_RESET_OPTIONS_USAGE,
  });
  if (typeof targetSessionKey !== "string") return targetSessionKey;
  return await withAcpCommandErrorBoundary({
    run: async () =>
      await getAcpSessionManager().resetSessionRuntimeOptions({
        cfg: params.cfg,
        sessionKey: targetSessionKey,
      }),
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "Could not reset ACP runtime options.",
    onSuccess: () => stopWithText(`✅ Reset ACP runtime options for ${targetSessionKey}.`),
  });
}
//#endregion
export {
  handleAcpCwdAction,
  handleAcpModelAction,
  handleAcpPermissionsAction,
  handleAcpResetOptionsAction,
  handleAcpSetAction,
  handleAcpSetModeAction,
  handleAcpStatusAction,
  handleAcpTimeoutAction,
};
