import fs from "node:fs";
import "./number-coercion-EqFmHmOw.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-nrmKYo2W.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import {
  i as resolveSessionFilePathOptions,
  r as resolveSessionFilePath,
} from "./paths-TfuVT-K8.js";
import { z as readTranscriptStatsSync } from "./session-accessor-PZVNxFCV.js";
import { _ as isTerminalSessionStatus } from "./store-CzZJhTF6.js";
//#region src/config/sessions/lifecycle.ts
/** Stable Gateway error detail for stale session lifecycle requests. */
const SESSION_LIFECYCLE_CHANGED_ERROR_REASON = "session-changed";
const SESSION_WORK_START_INVALIDATED_ERROR_CODE = "SESSION_WORK_START_INVALIDATED";
var SessionWorkStartInvalidatedError = class extends Error {
  constructor(message) {
    super(message);
    this.code = SESSION_WORK_START_INVALIDATED_ERROR_CODE;
    this.name = "SessionWorkStartInvalidatedError";
  }
};
function isSessionWorkStartInvalidatedError(error) {
  return (
    error instanceof SessionWorkStartInvalidatedError ||
    (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === SESSION_WORK_START_INVALIDATED_ERROR_CODE)
  );
}
/** Lifecycle-owned initializing and archived sessions reject new work. */
function resolveSessionWorkStartError(sessionKey, entry, options) {
  if (options?.expectedSessionId && !entry)
    return `Session "${sessionKey}" was deleted while starting work. Retry.`;
  if (options?.expectedSessionId && entry?.sessionId !== options.expectedSessionId)
    return `Session "${sessionKey}" changed while starting work. Retry.`;
  if (entry?.initializationPending === true)
    return `Session "${sessionKey}" is still initializing. Retry after initialization completes.`;
  return entry?.archivedAt === void 0
    ? void 0
    : `Session "${sessionKey}" is archived. Restore it before starting new work.`;
}
function resolveTimestamp(value) {
  const timestampMs = asDateTimestampMs(value);
  return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : void 0;
}
function resolvePositiveTimestamp(value) {
  const timestampMs = resolveTimestamp(value);
  return timestampMs !== void 0 && timestampMs > 0 ? timestampMs : void 0;
}
function parseTimestampMs(value) {
  if (typeof value === "number") return resolveTimestamp(value);
  if (typeof value !== "string" || !value.trim()) return;
  return resolveTimestamp(Date.parse(value));
}
function readFirstLine(filePath) {
  try {
    const fd = fs.openSync(filePath, "r");
    try {
      const buffer = Buffer.alloc(8192);
      const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
      if (bytesRead <= 0) return;
      const chunk = buffer.subarray(0, bytesRead).toString("utf8");
      const newline = chunk.indexOf("\n");
      return newline >= 0 ? chunk.slice(0, newline) : chunk;
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return;
  }
}
/** Reads session start time from a transcript header when store metadata is missing. */
function readSessionHeaderStartedAtMs(params) {
  const sessionId = params.entry?.sessionId?.trim();
  if (!sessionId) return;
  const pathOptions =
    params.pathOptions ??
    resolveSessionFilePathOptions({
      agentId: params.agentId,
      storePath: params.storePath,
    });
  let sessionFile;
  try {
    sessionFile = resolveSessionFilePath(sessionId, params.entry, pathOptions);
  } catch {
    return;
  }
  const firstLine = readFirstLine(sessionFile);
  if (!firstLine) return;
  try {
    const header = JSON.parse(firstLine);
    if (header.type !== "session") return;
    if (typeof header.id === "string" && header.id.trim() && header.id !== sessionId) return;
    return parseTimestampMs(header.timestamp);
  } catch {
    return;
  }
}
function resolveSessionLifecycleTimestamps(params) {
  const entry = params.entry;
  if (!entry) return {};
  return {
    sessionStartedAt:
      resolveTimestamp(entry.sessionStartedAt) ??
      readSessionHeaderStartedAtMs({
        entry,
        agentId: params.agentId,
        storePath: params.storePath,
        pathOptions: params.pathOptions,
      }),
    lastInteractionAt: resolveTimestamp(entry.lastInteractionAt),
  };
}
function resolveTerminalMainSessionTranscriptRegistryCheck(params) {
  if (!params.entry || !params.sessionKey) return;
  const configuredMainSessionKey = canonicalizeMainSessionAlias({
    cfg: {
      session: {
        scope: params.sessionScope,
        mainKey: params.mainKey,
      },
    },
    agentId: params.agentId,
    sessionKey: params.mainKey ?? "main",
  });
  if (
    canonicalizeMainSessionAlias({
      cfg: {
        session: {
          scope: params.sessionScope,
          mainKey: params.mainKey,
        },
      },
      agentId: params.agentId,
      sessionKey: params.sessionKey,
    }) !== configuredMainSessionKey
  )
    return;
  if (
    !(
      isTerminalSessionStatus(params.entry.status) ||
      resolvePositiveTimestamp(params.entry.endedAt) !== void 0
    )
  )
    return;
  if (params.entry.status === "done") return;
  if (params.entry.status === "failed") return;
  const registryTimestampMs = resolvePositiveTimestamp(params.entry.updatedAt);
  if (registryTimestampMs === void 0) return;
  const sessionId = typeof params.entry.sessionId === "string" ? params.entry.sessionId.trim() : "";
  if (!sessionId) return;
  return {
    sessionId,
    registryTimestampMs,
  };
}
function isTranscriptMutationNewerThanRegistry(params) {
  const transcriptMutationAtMs = Math.floor(params.transcriptMutationAtMs);
  const registryTimestampMs = Math.floor(params.registryTimestampMs);
  return Number.isFinite(transcriptMutationAtMs) && transcriptMutationAtMs > registryTimestampMs;
}
function hasTerminalMainSessionTranscriptNewerThanRegistrySync(params) {
  const check = resolveTerminalMainSessionTranscriptRegistryCheck(params);
  if (!check) return false;
  try {
    const stats = readTranscriptStatsSync({
      agentId: params.agentId,
      sessionId: check.sessionId,
      storePath: params.storePath,
    });
    if (stats.lastMutationAtMs === void 0) return false;
    return isTranscriptMutationNewerThanRegistry({
      transcriptMutationAtMs: stats.lastMutationAtMs,
      registryTimestampMs: stats.lastObservedMutationAtMs ?? check.registryTimestampMs,
    });
  } catch {
    return false;
  }
}
async function hasTerminalMainSessionTranscriptNewerThanRegistry(params) {
  return hasTerminalMainSessionTranscriptNewerThanRegistrySync(params);
}
//#endregion
export {
  isSessionWorkStartInvalidatedError as a,
  resolveTerminalMainSessionTranscriptRegistryCheck as c,
  hasTerminalMainSessionTranscriptNewerThanRegistrySync as i,
  SessionWorkStartInvalidatedError as n,
  resolveSessionLifecycleTimestamps as o,
  hasTerminalMainSessionTranscriptNewerThanRegistry as r,
  resolveSessionWorkStartError as s,
  SESSION_LIFECYCLE_CHANGED_ERROR_REASON as t,
};
