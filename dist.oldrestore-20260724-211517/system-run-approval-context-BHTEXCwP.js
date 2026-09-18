import {
  c as normalizeSystemRunApprovalPlan,
  d as normalizeStringArray,
  n as formatExecCommand,
  r as resolveSystemRunCommandRequest,
  u as normalizeNonEmptyString,
} from "./system-run-command-rsR6f6wc.js";
//#region src/infra/system-run-approval-context.ts
function normalizeCommandText(value) {
  return typeof value === "string" ? value : "";
}
function normalizeCommandPreview(value, authoritative) {
  const preview = normalizeNonEmptyString(value);
  if (!preview || preview === authoritative) return null;
  return preview;
}
function normalizePreparedRunExecPolicy(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const raw = value;
  const security = raw.security;
  const ask = raw.ask;
  if (
    (security === "deny" || security === "allowlist" || security === "full") &&
    (ask === "off" || ask === "on-miss" || ask === "always")
  )
    return {
      security,
      ask,
    };
}
function normalizeAllowAlwaysCoverage(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const raw = value;
  if (!Array.isArray(raw.patterns)) return;
  const patterns = raw.patterns.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const pattern = normalizeNonEmptyString(entry.pattern);
    if (!pattern) return [];
    const argPattern = normalizeNonEmptyString(entry.argPattern);
    return [
      {
        pattern,
        ...(argPattern ? { argPattern } : {}),
      },
    ];
  });
  return {
    complete: raw.complete === true,
    patterns,
  };
}
function parsePreparedSystemRunPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const raw = payload;
  const execPolicy = normalizePreparedRunExecPolicy(raw.execPolicy);
  const allowAlwaysCoverage = normalizeAllowAlwaysCoverage(raw.allowAlwaysCoverage);
  const plan = normalizeSystemRunApprovalPlan(raw.plan);
  if (plan)
    return {
      plan,
      ...(execPolicy ? { execPolicy } : {}),
      ...(allowAlwaysCoverage ? { allowAlwaysCoverage } : {}),
    };
  if (!raw.plan || typeof raw.plan !== "object" || Array.isArray(raw.plan)) return null;
  const legacyPlan = raw.plan;
  const argv = normalizeStringArray(legacyPlan.argv);
  const commandText =
    normalizeNonEmptyString(legacyPlan.rawCommand) ??
    normalizeNonEmptyString(raw.commandText) ??
    normalizeNonEmptyString(raw.cmdText);
  if (argv.length === 0 || !commandText) return null;
  return {
    plan: {
      argv,
      cwd: normalizeNonEmptyString(legacyPlan.cwd),
      commandText,
      commandPreview: normalizeNonEmptyString(legacyPlan.commandPreview),
      agentId: normalizeNonEmptyString(legacyPlan.agentId),
      sessionKey: normalizeNonEmptyString(legacyPlan.sessionKey),
    },
    ...(execPolicy ? { execPolicy } : {}),
    ...(allowAlwaysCoverage ? { allowAlwaysCoverage } : {}),
  };
}
/** Build the approval request context from tool payload fields. */
function resolveSystemRunApprovalRequestContext(params) {
  const normalizedPlan =
    (normalizeNonEmptyString(params.host) ?? "") === "node"
      ? normalizeSystemRunApprovalPlan(params.systemRunPlan)
      : null;
  const fallbackArgv = normalizeStringArray(params.commandArgv);
  const fallbackCommand = normalizeCommandText(params.command);
  const commandText = normalizedPlan
    ? normalizedPlan.commandText || formatExecCommand(normalizedPlan.argv)
    : fallbackCommand;
  const commandPreview = normalizedPlan
    ? normalizeCommandPreview(normalizedPlan.commandPreview ?? fallbackCommand, commandText)
    : null;
  const plan = normalizedPlan
    ? {
        ...normalizedPlan,
        commandPreview,
      }
    : null;
  return {
    plan,
    commandArgv: plan?.argv ?? (fallbackArgv.length > 0 ? fallbackArgv : void 0),
    commandText,
    commandPreview,
    cwd: plan?.cwd ?? normalizeNonEmptyString(params.cwd),
    agentId: plan?.agentId ?? normalizeNonEmptyString(params.agentId),
    sessionKey: plan?.sessionKey ?? normalizeNonEmptyString(params.sessionKey),
  };
}
/** Build the runtime approval context from already-normalized command inputs. */
function resolveSystemRunApprovalRuntimeContext(params) {
  const normalizedPlan = normalizeSystemRunApprovalPlan(params.plan ?? null);
  if (normalizedPlan)
    return {
      ok: true,
      plan: normalizedPlan,
      argv: [...normalizedPlan.argv],
      cwd: normalizedPlan.cwd,
      agentId: normalizedPlan.agentId,
      sessionKey: normalizedPlan.sessionKey,
      commandText: normalizedPlan.commandText,
    };
  const command = resolveSystemRunCommandRequest({
    command: params.command,
    rawCommand: params.rawCommand,
  });
  if (!command.ok)
    return {
      ok: false,
      message: command.message,
      details: command.details,
    };
  return {
    ok: true,
    plan: null,
    argv: command.argv,
    cwd: normalizeNonEmptyString(params.cwd),
    agentId: normalizeNonEmptyString(params.agentId),
    sessionKey: normalizeNonEmptyString(params.sessionKey),
    commandText: command.commandText,
  };
}
//#endregion
export {
  resolveSystemRunApprovalRequestContext as n,
  resolveSystemRunApprovalRuntimeContext as r,
  parsePreparedSystemRunPayload as t,
};
