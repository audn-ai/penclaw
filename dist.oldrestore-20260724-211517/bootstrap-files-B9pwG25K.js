import fs from "node:fs/promises";
import path from "node:path";
import "./utils-DtcDeqWS.js";
import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import { r as getOrLoadBootstrapFiles } from "./bootstrap-cache-C1XPSKEI.js";
import {
  f as buildBootstrapContextFiles,
  g as resolveBootstrapTotalMaxChars,
  m as resolveBootstrapMaxChars,
} from "./embedded-agent-helpers-DH71Di6x.js";
import { n as shouldIncludeHeartbeatGuidanceForSystemPrompt } from "./heartbeat-system-prompt-DoqehDUJ.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  m as triggerInternalHook,
  n as createInternalHookEvent,
} from "./internal-hooks-CckLIOgu.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  f as filterBootstrapFilesForSession,
  g as loadWorkspaceBootstrapFiles,
  m as isWorkspaceSetupCompleted,
  n as DEFAULT_BOOTSTRAP_FILENAME,
  r as DEFAULT_HEARTBEAT_FILENAME,
} from "./workspace-DXzCbuC0.js";
//#region src/agents/bootstrap-hooks.ts
/** Runs bootstrap hooks and returns the effective bootstrap file list. */
async function applyBootstrapHookOverrides(params) {
  const sessionKey = params.sessionKey ?? params.sessionId ?? "unknown";
  const agentId =
    params.agentId ??
    (params.sessionKey ? resolveAgentIdFromSessionKey(params.sessionKey) : void 0);
  const event = createInternalHookEvent("agent", "bootstrap", sessionKey, {
    workspaceDir: params.workspaceDir,
    bootstrapFiles: params.files,
    cfg: params.config,
    sessionKey: params.sessionKey,
    sessionId: params.sessionId,
    agentId,
  });
  await triggerInternalHook(event);
  const updated = event.context.bootstrapFiles;
  return Array.isArray(updated) ? updated : params.files;
}
//#endregion
//#region src/agents/bootstrap-files.ts
/**
 * Resolves workspace bootstrap files for agent runs and converts them into
 * bounded context files.
 */
const CONTINUATION_SCAN_MAX_TAIL_BYTES = 256 * 1024;
const FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE = "openclaw:bootstrap-context:full";
const BOOTSTRAP_WARNING_DEDUPE_LIMIT = 1024;
const seenBootstrapWarnings = /* @__PURE__ */ new Set();
const bootstrapWarningOrder = [];
function rememberBootstrapWarning(key) {
  if (seenBootstrapWarnings.has(key)) return false;
  if (seenBootstrapWarnings.size >= BOOTSTRAP_WARNING_DEDUPE_LIMIT) {
    const oldest = bootstrapWarningOrder.shift();
    if (oldest) seenBootstrapWarnings.delete(oldest);
  }
  seenBootstrapWarnings.add(key);
  bootstrapWarningOrder.push(key);
  return true;
}
/** Resolves the effective bootstrap injection mode for a session agent. */
function resolveContextInjectionMode(config, agentId) {
  const agentMode =
    config && agentId ? resolveAgentConfig(config, agentId)?.contextInjection : void 0;
  if (agentMode === "always" || agentMode === "continuation-skip" || agentMode === "never")
    return agentMode;
  return config?.agents?.defaults?.contextInjection ?? "always";
}
/** Checks whether the session transcript still has a valid full-bootstrap marker. */
async function hasCompletedBootstrapTurn(sessionFile) {
  if (parseSqliteSessionFileMarker(sessionFile)) return false;
  try {
    const stat = await fs.lstat(sessionFile);
    if (stat.isSymbolicLink()) return false;
    const fh = await fs.open(sessionFile, "r");
    try {
      const bytesToRead = Math.min(stat.size, CONTINUATION_SCAN_MAX_TAIL_BYTES);
      if (bytesToRead <= 0) return false;
      const start = stat.size - bytesToRead;
      const buffer = Buffer.allocUnsafe(bytesToRead);
      const { bytesRead } = await fh.read(buffer, 0, bytesToRead, start);
      let text = buffer.toString("utf-8", 0, bytesRead);
      if (start > 0) {
        const firstNewline = text.indexOf("\n");
        if (firstNewline === -1) return false;
        text = text.slice(firstNewline + 1);
      }
      const records = text
        .split(/\r?\n/u)
        .filter((line) => line.trim().length > 0)
        .slice(-500);
      let compactedAfterLatestAssistant = false;
      for (let i = records.length - 1; i >= 0; i--) {
        const line = records[i];
        if (!line) continue;
        let entry;
        try {
          entry = JSON.parse(line);
        } catch {
          continue;
        }
        const record = entry;
        if (record?.type === "compaction") {
          compactedAfterLatestAssistant = true;
          continue;
        }
        if (record?.type === "custom" && record.customType === "openclaw:bootstrap-context:full")
          return !compactedAfterLatestAssistant;
      }
      return false;
    } finally {
      await fh.close();
    }
  } catch {
    return false;
  }
}
/** Builds a session-scoped warning sink that dedupes repeated bootstrap warnings. */
function makeBootstrapWarn(params) {
  const warn = params.warn;
  if (!warn) return;
  const workspacePrefix = params.workspaceDir ?? "";
  return (message) => {
    if (!rememberBootstrapWarning(`${workspacePrefix}\u0000${params.sessionLabel}\u0000${message}`))
      return;
    warn(`${message} (sessionKey=${params.sessionLabel})`);
  };
}
function sanitizeBootstrapFiles(files, workspaceDir, warn) {
  const workspaceRoot = resolveUserPath(workspaceDir);
  const seenPaths = /* @__PURE__ */ new Set();
  const sanitized = [];
  for (const file of files) {
    const pathValue = normalizeOptionalString(file.path) ?? "";
    if (!pathValue) {
      warn?.(
        `skipping bootstrap file "${file.name}" — missing or invalid "path" field (hook may have used "filePath" instead)`,
      );
      continue;
    }
    const resolvedPath = path.isAbsolute(pathValue)
      ? path.resolve(pathValue)
      : pathValue.startsWith("~")
        ? resolveUserPath(pathValue)
        : path.resolve(workspaceRoot, pathValue);
    const dedupeKey = path.normalize(path.relative(workspaceRoot, resolvedPath));
    if (seenPaths.has(dedupeKey)) continue;
    seenPaths.add(dedupeKey);
    sanitized.push({
      ...file,
      path: resolvedPath,
    });
  }
  return sanitized;
}
function applyContextModeFilter(params) {
  const contextMode = params.contextMode ?? "full";
  const runKind = params.runKind ?? "default";
  if (contextMode !== "lightweight") return params.files;
  if (runKind === "heartbeat") return params.files.filter((file) => file.name === "HEARTBEAT.md");
  return [];
}
function shouldExcludeHeartbeatBootstrapFile(params) {
  if (params.runKind === "commitment-only") return true;
  if (!params.config || params.runKind === "heartbeat") return false;
  const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
    sessionKey: params.sessionKey ?? params.sessionId,
    config: params.config,
    agentId: params.agentId,
  });
  if (sessionAgentId !== defaultAgentId) return false;
  return !shouldIncludeHeartbeatGuidanceForSystemPrompt({
    config: params.config,
    agentId: sessionAgentId,
    defaultAgentId,
  });
}
function filterHeartbeatBootstrapFile(files, excludeHeartbeatBootstrapFile) {
  if (!excludeHeartbeatBootstrapFile) return files;
  return files.filter((file) => file.name !== DEFAULT_HEARTBEAT_FILENAME);
}
function filterCompletedWorkspaceBootstrapFile(files, setupCompleted, workspaceDir) {
  if (!setupCompleted) return files;
  const workspaceRoot = resolveUserPath(workspaceDir);
  const rootBootstrapPath = path.join(workspaceRoot, DEFAULT_BOOTSTRAP_FILENAME);
  return files.filter((file) => {
    if (file.name !== "BOOTSTRAP.md") return true;
    const pathValue = normalizeOptionalString(file.path);
    if (!pathValue) return true;
    return (
      (path.isAbsolute(pathValue)
        ? path.resolve(pathValue)
        : pathValue.startsWith("~")
          ? resolveUserPath(pathValue)
          : path.resolve(workspaceRoot, pathValue)) !== rootBootstrapPath
    );
  });
}
async function isWorkspaceSetupCompletedForContext(workspaceDir) {
  try {
    return await isWorkspaceSetupCompleted(workspaceDir);
  } catch {
    return false;
  }
}
/** Resolves hook-adjusted, session-filtered bootstrap files for a run. */
async function resolveBootstrapFilesForRun(params) {
  const excludeHeartbeatBootstrapFile = shouldExcludeHeartbeatBootstrapFile(params);
  const sessionKey = params.sessionKey ?? params.sessionId;
  const workspaceSetupCompleted = await isWorkspaceSetupCompletedForContext(params.workspaceDir);
  return sanitizeBootstrapFiles(
    filterHeartbeatBootstrapFile(
      filterCompletedWorkspaceBootstrapFile(
        await applyBootstrapHookOverrides({
          files: applyContextModeFilter({
            files: filterCompletedWorkspaceBootstrapFile(
              filterBootstrapFilesForSession(
                params.sessionKey
                  ? await getOrLoadBootstrapFiles({
                      workspaceDir: params.workspaceDir,
                      sessionKey: params.sessionKey,
                    })
                  : await loadWorkspaceBootstrapFiles(params.workspaceDir),
                sessionKey,
              ),
              workspaceSetupCompleted,
              params.workspaceDir,
            ),
            contextMode: params.contextMode,
            runKind: params.runKind,
          }),
          workspaceDir: params.workspaceDir,
          config: params.config,
          sessionKey: params.sessionKey,
          sessionId: params.sessionId,
          agentId: params.agentId,
        }),
        workspaceSetupCompleted,
        params.workspaceDir,
      ),
      excludeHeartbeatBootstrapFile,
    ),
    params.workspaceDir,
    params.warn,
  );
}
/** Resolves both raw bootstrap metadata and bounded context files for a run. */
async function resolveBootstrapContextForRun(params) {
  const bootstrapFiles = await resolveBootstrapFilesForRun(params);
  return {
    bootstrapFiles,
    contextFiles: buildBootstrapContextForFiles(bootstrapFiles, params),
  };
}
/** Builds bounded context files from already-resolved bootstrap file metadata. */
function buildBootstrapContextForFiles(bootstrapFiles, params) {
  return buildBootstrapContextFiles(bootstrapFiles, {
    maxChars: resolveBootstrapMaxChars(params.config, params.agentId),
    totalMaxChars: resolveBootstrapTotalMaxChars(params.config, params.agentId),
    warn: params.warn,
  });
}
//#endregion
export {
  resolveBootstrapContextForRun as a,
  makeBootstrapWarn as i,
  buildBootstrapContextForFiles as n,
  resolveBootstrapFilesForRun as o,
  hasCompletedBootstrapTurn as r,
  resolveContextInjectionMode as s,
  FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE as t,
};
