import { existsSync } from "node:fs";
import path from "node:path";
import { r as resolveBundledPluginInstallCommandHint } from "./bundled-sources-D7CuFv_v.js";
import "./errors-CDrK1ZOW.js";
import { n as resolveAcpCommandBindingContext } from "./context-DCLs3MVz.js";
import { t as formatAcpRuntimeErrorText } from "./error-text-ojwLnndS.js";
import { a as toAcpRuntimeError } from "./errors-BTjUwYsc.js";
import { t as getAcpSessionManager } from "./manager-CU7-9RFR.js";
import { r as requireAcpRuntimeBackend, t as getAcpRuntimeBackend } from "./registry-BVG2dQ33.js";
import { n as getSessionBindingService } from "./session-binding-service-DPVMwWUH.js";
import { t as listAcpSessionEntries } from "./session-meta-IQvNG5NK.js";
import {
  C as stopWithText,
  n as ACP_DOCTOR_USAGE,
  p as formatAcpCapabilitiesText,
  r as ACP_INSTALL_USAGE,
  s as ACP_SESSIONS_USAGE,
} from "./shared-KqG9R6lH.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { n as resolveBoundAcpThreadSessionKey } from "./targets-nOa_2yOU.js";
//#region src/auto-reply/reply/commands-acp/install-hints.ts
/** Resolves the install command hint shown when the configured ACP backend is missing. */
function resolveAcpInstallCommandHint(cfg) {
  const configured = normalizeOptionalString(cfg.acp?.runtime?.installCommand);
  if (configured) return configured;
  const workspaceDir = process.cwd();
  const backendId = normalizeOptionalLowercaseString(cfg.acp?.backend) ?? "acpx";
  if (backendId === "acpx") {
    const workspaceLocalPath = path.join(workspaceDir, "extensions", "acpx");
    if (existsSync(workspaceLocalPath)) return `openclaw plugins install ${workspaceLocalPath}`;
    const bundledInstallHint = resolveBundledPluginInstallCommandHint({
      pluginId: backendId,
      workspaceDir,
    });
    if (bundledInstallHint) {
      const localPath = bundledInstallHint.replace(/^openclaw plugins install /u, "");
      const resolvedLocalPath = path.resolve(localPath);
      const relativeToWorkspace = path.relative(workspaceDir, resolvedLocalPath);
      if (
        (relativeToWorkspace.length === 0 ||
          (!relativeToWorkspace.startsWith("..") && !path.isAbsolute(relativeToWorkspace))) &&
        existsSync(resolvedLocalPath)
      )
        return bundledInstallHint;
    }
    return "openclaw plugins install acpx";
  }
  return `Install and enable the plugin that provides ACP backend "${backendId}".`;
}
//#endregion
//#region src/auto-reply/reply/commands-acp/diagnostics.ts
function isBackendPluginBlockedByAllowlist(params) {
  const allow = params.cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.length === 0) return false;
  const normalizedBackendId = normalizeLowercaseStringOrEmpty(params.backendId);
  if (!normalizedBackendId) return false;
  return !allow.some(
    (pluginId) => normalizeLowercaseStringOrEmpty(pluginId) === normalizedBackendId,
  );
}
async function handleAcpDoctorAction(params, restTokens) {
  if (restTokens.length > 0) return stopWithText(`⚠️ ${ACP_DOCTOR_USAGE}`);
  const backendId = normalizeOptionalString(params.cfg.acp?.backend) ?? "acpx";
  const installHint = resolveAcpInstallCommandHint(params.cfg);
  const registeredBackend = getAcpRuntimeBackend(backendId);
  const managerSnapshot = getAcpSessionManager().getObservabilitySnapshot(params.cfg);
  const lines = ["ACP doctor:", "-----", `configuredBackend: ${backendId}`];
  lines.push(`activeRuntimeSessions: ${managerSnapshot.runtimeCache.activeSessions}`);
  lines.push(`runtimeIdleTtlMs: ${managerSnapshot.runtimeCache.idleTtlMs}`);
  lines.push(`evictedIdleRuntimes: ${managerSnapshot.runtimeCache.evictedTotal}`);
  lines.push(`activeTurns: ${managerSnapshot.turns.active}`);
  lines.push(`queueDepth: ${managerSnapshot.turns.queueDepth}`);
  lines.push(
    `turnLatencyMs: avg=${managerSnapshot.turns.averageLatencyMs}, max=${managerSnapshot.turns.maxLatencyMs}`,
  );
  lines.push(
    `turnCounts: completed=${managerSnapshot.turns.completed}, failed=${managerSnapshot.turns.failed}`,
  );
  const errorStatsText =
    Object.entries(managerSnapshot.errorsByCode)
      .map(([code, count]) => `${code}=${count}`)
      .join(", ") || "(none)";
  lines.push(`errorCodes: ${errorStatsText}`);
  if (registeredBackend) lines.push(`registeredBackend: ${registeredBackend.id}`);
  else lines.push("registeredBackend: (none)");
  const backendBlockedByAllowlist = isBackendPluginBlockedByAllowlist({
    cfg: params.cfg,
    backendId,
  });
  if (backendBlockedByAllowlist)
    lines.push(`pluginActivation: blocked (${backendId} is missing from plugins.allow)`);
  if (registeredBackend?.runtime.doctor)
    try {
      const report = await registeredBackend.runtime.doctor();
      lines.push(`runtimeDoctor: ${report.ok ? "ok" : "error"} (${report.message})`);
      if (report.code) lines.push(`runtimeDoctorCode: ${report.code}`);
      if (report.installCommand) lines.push(`runtimeDoctorInstall: ${report.installCommand}`);
      for (const detail of report.details ?? []) lines.push(`runtimeDoctorDetail: ${detail}`);
    } catch (error) {
      lines.push(
        `runtimeDoctor: error (${
          toAcpRuntimeError({
            error,
            fallbackCode: "ACP_TURN_FAILED",
            fallbackMessage: "Runtime doctor failed.",
          }).message
        })`,
      );
    }
  try {
    const backend = requireAcpRuntimeBackend(backendId);
    const capabilities = backend.runtime.getCapabilities
      ? await backend.runtime.getCapabilities({})
      : {
          controls: [],
          configOptionKeys: [],
        };
    lines.push("healthy: yes");
    lines.push(`capabilities: ${formatAcpCapabilitiesText(capabilities.controls ?? [])}`);
    if ((capabilities.configOptionKeys?.length ?? 0) > 0)
      lines.push(`configKeys: ${capabilities.configOptionKeys?.join(", ")}`);
    return stopWithText(lines.join("\n"));
  } catch (error) {
    const acpError = toAcpRuntimeError({
      error,
      fallbackCode: "ACP_TURN_FAILED",
      fallbackMessage: "ACP backend doctor failed.",
    });
    lines.push("healthy: no");
    lines.push(formatAcpRuntimeErrorText(acpError));
    if (backendBlockedByAllowlist)
      lines.push(`next: add "${backendId}" to plugins.allow or unset plugins.allow.`);
    lines.push(`next: ${installHint}`);
    lines.push(`next: openclaw config set plugins.entries.${backendId}.enabled true`);
    if (normalizeLowercaseStringOrEmpty(backendId) === "acpx")
      lines.push("next: verify acpx is installed (`acpx --help`).");
    return stopWithText(lines.join("\n"));
  }
}
function handleAcpInstallAction(params, restTokens) {
  if (restTokens.length > 0) return stopWithText(`⚠️ ${ACP_INSTALL_USAGE}`);
  const backendId = normalizeOptionalString(params.cfg.acp?.backend) ?? "acpx";
  const installHint = resolveAcpInstallCommandHint(params.cfg);
  return stopWithText(
    [
      "ACP install:",
      "-----",
      `configuredBackend: ${backendId}`,
      `run: ${installHint}`,
      `then: openclaw config set plugins.entries.${backendId}.enabled true`,
      "then: /acp doctor",
    ].join("\n"),
  );
}
function formatAcpSessionLine(params) {
  const acp = params.acp;
  const marker = params.currentSessionKey === params.key ? "*" : " ";
  const label = normalizeOptionalString(params.entry.label) || acp.agent;
  const threadText = params.threadId ? `, thread:${params.threadId}` : "";
  return `${marker} ${label} (${acp.mode}, ${acp.state}, backend:${acp.backend}${threadText}) -> ${params.key}`;
}
async function handleAcpSessionsAction(params, restTokens) {
  if (restTokens.length > 0) return stopWithText(ACP_SESSIONS_USAGE);
  const currentSessionKey = resolveBoundAcpThreadSessionKey(params) || params.sessionKey;
  if (!currentSessionKey) return stopWithText("⚠️ Missing session key.");
  const bindingContext = resolveAcpCommandBindingContext(params);
  const normalizedChannel = bindingContext.channel;
  const normalizedAccountId = bindingContext.accountId || void 0;
  const bindingService = getSessionBindingService();
  const rows = (await listAcpSessionEntries({ cfg: params.cfg }))
    .toSorted((a, b) => (b.entry?.updatedAt ?? 0) - (a.entry?.updatedAt ?? 0))
    .slice(0, 20)
    .map(({ storeSessionKey, entry, acp }) => {
      if (!entry || !acp) return "";
      const bindingThreadId = bindingService
        .listBySession(storeSessionKey)
        .find(
          (binding) =>
            (!normalizedChannel || binding.conversation.channel === normalizedChannel) &&
            (!normalizedAccountId || binding.conversation.accountId === normalizedAccountId),
        )?.conversation.conversationId;
      return formatAcpSessionLine({
        key: storeSessionKey,
        entry,
        acp,
        currentSessionKey,
        threadId: bindingThreadId,
      });
    })
    .filter(Boolean);
  if (rows.length === 0) return stopWithText("ACP sessions:\n-----\n(none)");
  return stopWithText(["ACP sessions:", "-----", ...rows].join("\n"));
}
//#endregion
export { handleAcpDoctorAction, handleAcpInstallAction, handleAcpSessionsAction };
