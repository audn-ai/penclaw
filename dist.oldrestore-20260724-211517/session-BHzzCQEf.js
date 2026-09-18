import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  c as ACTIVE_MEMORY_STATUS_PREFIX,
  r as ACTIVE_MEMORY_DEBUG_PREFIX,
} from "./types-gz2L16qk.js";
//#region extensions/active-memory/session.ts
function resolveCanonicalSessionKeyFromSessionId(params) {
  const sessionId = params.sessionId?.trim();
  if (!sessionId) return;
  try {
    let bestMatch;
    for (const { sessionKey, entry } of params.api.runtime.agent.session.listSessionEntries({
      agentId: params.agentId,
    })) {
      if (!entry || typeof entry !== "object") continue;
      const candidateSessionId = typeof entry.sessionId === "string" ? entry.sessionId?.trim() : "";
      if (!candidateSessionId || candidateSessionId !== sessionId) continue;
      const updatedAt = typeof entry.updatedAt === "number" ? (entry.updatedAt ?? 0) : 0;
      if (!bestMatch || updatedAt > bestMatch.updatedAt)
        bestMatch = {
          sessionKey,
          updatedAt,
        };
    }
    return bestMatch?.sessionKey?.trim() || void 0;
  } catch {
    return;
  }
}
function resolveRecallRunChannelContext(params) {
  const isRunnableChannelName = (channel) => !channel.includes(":") && !channel.includes("/");
  const explicitChannel = normalizeOptionalString(params.channelId);
  const explicitProvider = normalizeOptionalString(params.messageProvider);
  const runnableExplicitChannel =
    explicitChannel && isRunnableChannelName(explicitChannel) ? explicitChannel : void 0;
  const trustedExplicitChannel =
    runnableExplicitChannel &&
    runnableExplicitChannel !== explicitProvider &&
    (!explicitProvider || explicitProvider === "webchat")
      ? runnableExplicitChannel
      : void 0;
  const resolveReturnValue = (paramsLocal) => {
    const trustedResolvedChannel =
      paramsLocal.resolvedChannelStrength === "strong" ? paramsLocal.resolvedChannel : void 0;
    return {
      messageChannel:
        trustedExplicitChannel ??
        trustedResolvedChannel ??
        explicitProvider ??
        runnableExplicitChannel ??
        paramsLocal.resolvedChannel,
      messageProvider:
        trustedExplicitChannel ??
        trustedResolvedChannel ??
        explicitProvider ??
        runnableExplicitChannel ??
        paramsLocal.resolvedChannel,
    };
  };
  const resolvedSessionKey =
    normalizeOptionalString(params.sessionKey) ??
    resolveCanonicalSessionKeyFromSessionId({
      api: params.api,
      agentId: params.agentId,
      sessionId: params.sessionId,
    });
  if (!resolvedSessionKey) return resolveReturnValue({});
  try {
    const sessionEntry = params.api.runtime.agent.session.getSessionEntry({
      agentId: params.agentId,
      sessionKey: resolvedSessionKey,
    });
    const rawStrongEntryChannel =
      normalizeOptionalString(sessionEntry?.lastChannel) ??
      normalizeOptionalString(sessionEntry?.channel);
    const strongEntryChannel =
      rawStrongEntryChannel && isRunnableChannelName(rawStrongEntryChannel)
        ? rawStrongEntryChannel
        : void 0;
    const weakEntryChannel = normalizeOptionalString(sessionEntry?.origin?.provider);
    return resolveReturnValue({
      resolvedChannel: strongEntryChannel ?? weakEntryChannel,
      resolvedChannelStrength: strongEntryChannel ? "strong" : weakEntryChannel ? "weak" : void 0,
    });
  } catch {
    return resolveReturnValue({});
  }
}
function resolveStatusUpdateAgentId(ctx) {
  const explicit = ctx.agentId?.trim();
  if (explicit) return explicit;
  const sessionKey = ctx.sessionKey?.trim();
  if (!sessionKey) return "";
  return /^agent:([^:]+):/i.exec(sessionKey)?.[1]?.trim() ?? "";
}
function formatElapsedMsCompact(elapsedMs) {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return "0ms";
  if (elapsedMs >= 1e3) {
    const seconds = elapsedMs / 1e3;
    return `${seconds % 1 === 0 ? seconds.toFixed(0) : seconds.toFixed(1)}s`;
  }
  return `${Math.round(elapsedMs)}ms`;
}
function buildPluginStatusLine(params) {
  const parts = [
    ACTIVE_MEMORY_STATUS_PREFIX,
    `status=${params.result.status}`,
    `elapsed=${formatElapsedMsCompact(params.result.elapsedMs)}`,
    `query=${params.config.queryMode}`,
  ];
  if (params.result.summary && params.result.summary.length > 0)
    parts.push(`summary=${params.result.summary.length} chars`);
  return parts.join(" ");
}
function buildPersistedDebugSummary(result) {
  if (result.status === "timeout_partial")
    return `timeout_partial: ${String(result.summary.length)} chars recovered (not persisted)`;
  return result.summary;
}
function buildPluginDebugLine(params) {
  const cleaned = sanitizeDebugText(params.summary ?? "");
  const warning = sanitizeDebugText(params.searchDebug?.warning ?? "");
  const action = sanitizeDebugText(params.searchDebug?.action ?? "");
  const error = sanitizeDebugText(params.searchDebug?.error ?? "");
  const debugParts = [];
  const backend = sanitizeDebugText(params.searchDebug?.backend ?? "");
  if (backend) debugParts.push(`backend=${backend}`);
  const configuredMode = sanitizeDebugText(params.searchDebug?.configuredMode ?? "");
  if (configuredMode) debugParts.push(`configuredMode=${configuredMode}`);
  const effectiveMode = sanitizeDebugText(params.searchDebug?.effectiveMode ?? "");
  if (effectiveMode) debugParts.push(`effectiveMode=${effectiveMode}`);
  const fallback = sanitizeDebugText(params.searchDebug?.fallback ?? "");
  if (fallback) debugParts.push(`fallback=${fallback}`);
  if (
    typeof params.searchDebug?.searchMs === "number" &&
    Number.isFinite(params.searchDebug.searchMs)
  )
    debugParts.push(`searchMs=${Math.max(0, Math.round(params.searchDebug.searchMs))}`);
  if (typeof params.searchDebug?.hits === "number" && Number.isFinite(params.searchDebug.hits))
    debugParts.push(`hits=${Math.max(0, Math.floor(params.searchDebug.hits))}`);
  const prefix = debugParts.join(" ");
  const messages = uniqueStrings(
    [
      warning && action && !cleaned
        ? `${warning} ${action}`
        : [warning, action && !cleaned ? action : ""].filter((value) => Boolean(value)).join(" | "),
      cleaned,
    ].filter((value) => Boolean(value)),
  ).join(" | ");
  const trailing = messages;
  if (prefix && trailing) return `${ACTIVE_MEMORY_DEBUG_PREFIX} ${prefix} | ${trailing}`;
  if (prefix) return `${ACTIVE_MEMORY_DEBUG_PREFIX} ${prefix}`;
  if (messages) return `${ACTIVE_MEMORY_DEBUG_PREFIX} ${messages}`;
  if (warning) return `${ACTIVE_MEMORY_DEBUG_PREFIX} ${warning}`;
  if (cleaned) return `${ACTIVE_MEMORY_DEBUG_PREFIX} ${cleaned}`;
  if (error) return `${ACTIVE_MEMORY_DEBUG_PREFIX} ${error}`;
  return null;
}
function sanitizeDebugText(text) {
  let sanitized = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (!((code >= 0 && code <= 31) || (code >= 127 && code <= 159))) sanitized += ch;
  }
  return sanitized.replace(/\s+/g, " ").trim();
}
async function persistPluginStatusLines(params) {
  const sessionKey = params.sessionKey?.trim();
  if (!sessionKey) return;
  const debugLine = buildPluginDebugLine({
    summary: params.debugSummary,
    searchDebug: params.searchDebug,
  });
  const agentId = params.agentId.trim();
  if (!agentId && (params.statusLine || debugLine)) return;
  try {
    if (!params.statusLine && !debugLine) {
      const existingEntry = params.api.runtime.agent.session.getSessionEntry({
        agentId,
        sessionKey,
      });
      if (
        !(Array.isArray(existingEntry?.pluginDebugEntries)
          ? existingEntry.pluginDebugEntries.some((entry) => entry?.pluginId === "active-memory")
          : false)
      )
        return;
    }
    await params.api.runtime.agent.session.patchSessionEntry({
      agentId,
      sessionKey,
      preserveActivity: true,
      update: (existing) => {
        const nextEntries = (
          Array.isArray(existing.pluginDebugEntries) ? existing.pluginDebugEntries : []
        ).filter(
          (entry) =>
            Boolean(entry) &&
            typeof entry === "object" &&
            typeof entry.pluginId === "string" &&
            entry.pluginId !== "active-memory",
        );
        const nextLines = [];
        if (params.statusLine) nextLines.push(params.statusLine);
        if (debugLine) nextLines.push(debugLine);
        if (nextLines.length > 0)
          nextEntries.push({
            pluginId: "active-memory",
            lines: nextLines,
          });
        return { pluginDebugEntries: nextEntries.length > 0 ? nextEntries : void 0 };
      },
    });
  } catch (error) {
    params.api.logger.debug?.(
      `active-memory: failed to persist session status note (${error instanceof Error ? error.message : String(error)})`,
    );
  }
}
//#endregion
export {
  resolveRecallRunChannelContext as a,
  resolveCanonicalSessionKeyFromSessionId as i,
  buildPluginStatusLine as n,
  resolveStatusUpdateAgentId as o,
  persistPluginStatusLines as r,
  buildPersistedDebugSummary as t,
};
