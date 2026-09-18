import { createHash } from "node:crypto";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./agent-scope-y9xQv_q1.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as resolveSessionKeyForRun } from "./server-session-key-CtUYjV6x.js";
import {
  Jt as resolveSessionStoreKey,
  Yt as resolveStoredSessionKeyForAgentStore,
  qt as resolveSessionStoreAgentId,
} from "./session-accessor-PZVNxFCV.js";
import {
  d as resolveAgentIdFromSessionKey,
  v as toAgentStoreSessionKey,
} from "./session-key-druuY-GG.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { g as visitSessionMessagesAsync } from "./session-transcript-readers-Bv0ty7AX.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import {
  C as validateArtifactsGetParams,
  S as validateArtifactsDownloadParams,
  w as validateArtifactsListParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as getTaskSessionLookupByIdForStatus } from "./task-status-access-BVw-UeJU.js";
import { n as isHttpUrl } from "./url-protocol-oWYinajA.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
//#region src/gateway/server-methods/artifacts.ts
function artifactError(type, message, details) {
  return errorShape(ErrorCodes.INVALID_REQUEST, message, {
    details: {
      type,
      ...details,
    },
  });
}
function resolveRequesterSessionAgentId(sessionKey, cfg) {
  const key = normalizeOptionalString(sessionKey);
  if (!key) return;
  const parsed = parseAgentSessionKey(key);
  if (!parsed && key.toLowerCase().startsWith("agent:")) return;
  if (cfg)
    return resolveSessionStoreAgentId(
      cfg,
      resolveSessionStoreKey({
        cfg,
        sessionKey: key,
      }),
    );
  if (parsed) return parsed.agentId;
  return resolveAgentIdFromSessionKey(key);
}
/** Applies an optional agent scope to a transcript session key without crossing stores. */
function resolveScopedArtifactSessionKey(sessionKey, agentId, cfg) {
  const key = normalizeOptionalString(sessionKey);
  if (!key) return;
  const scopedAgentId = normalizeOptionalString(agentId);
  if (!scopedAgentId) return key;
  const parsed = parseAgentSessionKey(key);
  if (!parsed && key.toLowerCase().startsWith("agent:")) return;
  if (cfg) {
    const scopedKey = resolveStoredSessionKeyForAgentStore({
      cfg,
      agentId: scopedAgentId,
      sessionKey: key,
    });
    if (
      scopedKey !== "global" &&
      scopedKey !== "unknown" &&
      resolveSessionStoreAgentId(cfg, scopedKey) !== normalizeAgentId(scopedAgentId)
    )
      return;
    return scopedKey;
  }
  if (parsed && parsed.agentId !== normalizeAgentId(scopedAgentId)) return;
  return toAgentStoreSessionKey({
    agentId: scopedAgentId,
    requestKey: key,
  });
}
function normalizeArtifactType(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "image" || normalized === "input_image" || normalized === "image_url")
    return "image";
  if (normalized === "audio" || normalized === "input_audio") return "audio";
  if (normalized === "file" || normalized === "input_file") return "file";
  return "file";
}
function mimeFromDataUrl(value) {
  return /^data:([^;,]+)(?:;[^,]*)?,/i.exec(value.trim())?.[1]?.toLowerCase();
}
function base64FromDataUrl(value) {
  const trimmed = value.trim();
  const commaIndex = trimmed.indexOf(",");
  if (commaIndex < 0 || trimmed.slice(0, 5).toLowerCase() !== "data:") return;
  if (!trimmed.slice(0, commaIndex).toLowerCase().includes(";base64")) return;
  return trimmed.slice(commaIndex + 1);
}
function isBase64Whitespace(value) {
  return value === " " || value === "\n" || value === "\r" || value === "	";
}
function isArtifactBase64DataChar(value) {
  const code = value.charCodeAt(0);
  return (
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 48 && code <= 57) ||
    value === "+" ||
    value === "/" ||
    value === "-" ||
    value === "_"
  );
}
function normalizeArtifactBase64Char(value) {
  if (value === "-") return "+";
  if (value === "_") return "/";
  return value;
}
function readArtifactBase64Payload(value, opts) {
  if (!value) return;
  let encodedLength = 0;
  let padding = 0;
  let sawPadding = false;
  let data = opts.includeData ? "" : void 0;
  for (const char of value) {
    if (isBase64Whitespace(char)) continue;
    if (char === "=") {
      padding += 1;
      if (padding > 2) return;
      sawPadding = true;
      encodedLength += 1;
      if (data !== void 0) data += char;
      continue;
    }
    if (sawPadding || !isArtifactBase64DataChar(char)) return;
    encodedLength += 1;
    if (data !== void 0) data += normalizeArtifactBase64Char(char);
  }
  if (encodedLength === 0) return;
  const remainder = encodedLength % 4;
  if ((padding > 0 && remainder !== 0) || remainder === 1) return;
  if (data !== void 0 && padding === 0 && remainder > 0) data += "=".repeat(4 - remainder);
  return {
    ...(data !== void 0 ? { data } : {}),
    sizeBytes: Math.max(0, Math.floor((encodedLength * 3) / 4) - padding),
  };
}
function mediaUrlValue(value) {
  if (typeof value === "string") return normalizeOptionalString(value);
  return normalizeOptionalString(asOptionalRecord(value)?.url);
}
function isSafeDownloadUrl(value) {
  const trimmed = value.trim();
  if (!trimmed || /^data:/i.test(trimmed)) return false;
  if (trimmed.startsWith("/")) return !trimmed.startsWith("//") && trimmed.startsWith("/api/");
  return isHttpUrl(trimmed);
}
/** Generates a stable id from transcript position plus display metadata. */
function artifactId(parts) {
  return `artifact_${createHash("sha256").update(`${parts.sessionKey}\0${parts.messageSeq}\0${parts.contentIndex}\0${parts.type}\0${parts.title}`).digest("base64url").slice(0, 18)}`;
}
function resolveMessageSeq(message, fallback) {
  const seq = asOptionalRecord(message["__openclaw"])?.seq;
  return typeof seq === "number" && Number.isInteger(seq) && seq > 0 ? seq : fallback;
}
function resolveMessageRunId(message) {
  return (
    normalizeOptionalString(asOptionalRecord(message["__openclaw"])?.runId) ??
    normalizeOptionalString(message.runId)
  );
}
function resolveMessageTaskId(message) {
  const meta = asOptionalRecord(message["__openclaw"]);
  return (
    normalizeOptionalString(meta?.messageTaskId) ??
    normalizeOptionalString(meta?.taskId) ??
    normalizeOptionalString(message.messageTaskId) ??
    normalizeOptionalString(message.taskId)
  );
}
function resolveBlockDownload(block, opts) {
  const data = normalizeOptionalString(block.data);
  const content = normalizeOptionalString(block.content);
  const url = normalizeOptionalString(block.url) ?? normalizeOptionalString(block.openUrl);
  const imageUrl = mediaUrlValue(block.image_url);
  const audioUrl = normalizeOptionalString(block.audio_url);
  const source = asOptionalRecord(block.source);
  const sourceData = normalizeOptionalString(source?.data);
  const sourceUrl = normalizeOptionalString(source?.url);
  const dataUrl = [url, sourceUrl, imageUrl, audioUrl, data, content, sourceData].find(
    (value) => typeof value === "string" && /^data:/i.test(value),
  );
  const base64FromDetectedDataUrl = readArtifactBase64Payload(
    dataUrl ? base64FromDataUrl(dataUrl) : void 0,
    opts,
  );
  const directBase64 = [data, sourceData, content]
    .filter((value) => typeof value === "string" && !/^data:/i.test(value))
    .map((value) => readArtifactBase64Payload(value, opts))
    .find((value) => value !== void 0);
  const base64 = base64FromDetectedDataUrl ?? directBase64;
  const remoteUrl = [url, sourceUrl, imageUrl, audioUrl].find(
    (value) => typeof value === "string" && isSafeDownloadUrl(value),
  );
  const mimeType =
    normalizeOptionalString(block.mimeType) ??
    normalizeOptionalString(block.media_type) ??
    normalizeOptionalString(source?.media_type) ??
    normalizeOptionalString(source?.mimeType) ??
    (dataUrl ? mimeFromDataUrl(dataUrl) : void 0);
  const explicitSize = block.sizeBytes ?? source?.sizeBytes;
  const sizeBytes =
    typeof explicitSize === "number" && Number.isFinite(explicitSize) && explicitSize >= 0
      ? Math.floor(explicitSize)
      : base64?.sizeBytes;
  if (base64)
    return {
      mode: "bytes",
      ...(base64.data ? { data: base64.data } : {}),
      mimeType,
      sizeBytes,
    };
  if (remoteUrl)
    return {
      mode: "url",
      url: remoteUrl,
      mimeType,
      sizeBytes,
    };
  return {
    mode: "unsupported",
    mimeType,
    sizeBytes,
  };
}
function isArtifactBlock(block) {
  const type = normalizeOptionalString(block.type)?.toLowerCase();
  if (
    type === "image" ||
    type === "audio" ||
    type === "file" ||
    type === "input_image" ||
    type === "input_audio" ||
    type === "input_file" ||
    type === "image_url"
  )
    return true;
  return Boolean(
    block.url || block.openUrl || block.data || block.source || block.image_url || block.audio_url,
  );
}
function collectArtifactsFromMessage(params) {
  const msg = asOptionalRecord(params.message);
  if (!msg) return;
  const messageSeq = resolveMessageSeq(msg, params.messageFallbackSeq);
  const messageRunId = resolveMessageRunId(msg);
  const messageTaskId = resolveMessageTaskId(msg);
  if (params.runId && messageRunId !== params.runId) return;
  if (params.taskId && messageTaskId !== params.taskId) return;
  const content = Array.isArray(msg.content) ? msg.content : [];
  for (let contentIndex = 0; contentIndex < content.length; contentIndex += 1) {
    const block = asOptionalRecord(content[contentIndex]);
    if (!block || !isArtifactBlock(block)) continue;
    const type = normalizeArtifactType(normalizeOptionalString(block.type) ?? "file");
    const title =
      normalizeOptionalString(block.title) ??
      normalizeOptionalString(block.fileName) ??
      normalizeOptionalString(block.filename) ??
      normalizeOptionalString(block.alt) ??
      `${type} ${params.artifacts.length + 1}`;
    const id = artifactId({
      sessionKey: params.sessionKey,
      messageSeq,
      contentIndex,
      title,
      type,
    });
    const download = resolveBlockDownload(block, {
      includeData: params.downloadArtifactId
        ? params.downloadArtifactId === id
        : params.includeDownloadData !== false,
    });
    const summary = {
      id,
      type,
      title,
      ...(download.mimeType ? { mimeType: download.mimeType } : {}),
      ...(download.sizeBytes !== void 0 ? { sizeBytes: download.sizeBytes } : {}),
      sessionKey: params.sessionKey,
      ...(messageRunId ? { runId: messageRunId } : {}),
      ...(messageTaskId ? { taskId: messageTaskId } : {}),
      messageSeq,
      source: "session-transcript",
      download: { mode: download.mode },
      ...(download.data ? { data: download.data } : {}),
      ...(download.url ? { url: download.url } : {}),
    };
    params.artifacts.push(summary);
  }
}
function resolveQuerySession(query, cfg) {
  if (query.sessionKey) {
    const sessionKey = resolveScopedArtifactSessionKey(query.sessionKey, query.agentId, cfg);
    if (!sessionKey) return;
    return {
      sessionKey,
      ...(query.agentId ? { agentId: query.agentId } : {}),
    };
  }
  if (query.runId) {
    const agentId = query.agentId ?? resolveDefaultAgentId(cfg ?? {});
    const scopedSessionKey = resolveScopedArtifactSessionKey(
      resolveSessionKeyForRun(query.runId, { agentId }),
      agentId,
      cfg,
    );
    return scopedSessionKey
      ? {
          sessionKey: scopedSessionKey,
          agentId,
        }
      : void 0;
  }
  if (query.taskId) {
    const task = getTaskSessionLookupByIdForStatus(query.taskId);
    const requesterSessionKey = normalizeOptionalString(task?.requesterSessionKey);
    const ownerAgentId = parseAgentSessionKey(task?.ownerKey)?.agentId;
    const requesterAgentId =
      normalizeOptionalString(task?.requesterAgentId) ??
      ownerAgentId ??
      (requesterSessionKey === "global"
        ? void 0
        : resolveRequesterSessionAgentId(requesterSessionKey, cfg));
    const taskAgentId = normalizeOptionalString(task?.agentId) ?? requesterAgentId;
    if (
      query.agentId &&
      taskAgentId &&
      normalizeAgentId(query.agentId) !== normalizeAgentId(taskAgentId)
    )
      return;
    if (requesterSessionKey) {
      const sessionAgentId = requesterAgentId ?? taskAgentId ?? resolveDefaultAgentId(cfg ?? {});
      const scopedSessionKey = resolveScopedArtifactSessionKey(
        requesterSessionKey,
        sessionAgentId,
        cfg,
      );
      return scopedSessionKey
        ? {
            sessionKey: scopedSessionKey,
            agentId: sessionAgentId,
          }
        : void 0;
    }
    const agentId = query.agentId ?? taskAgentId ?? resolveDefaultAgentId(cfg ?? {});
    const runId = normalizeOptionalString(task?.runId);
    const scopedSessionKey = resolveScopedArtifactSessionKey(
      runId ? resolveSessionKeyForRun(runId, { agentId }) : void 0,
      agentId,
      cfg,
    );
    return scopedSessionKey
      ? {
          sessionKey: scopedSessionKey,
          agentId,
        }
      : void 0;
  }
}
/** Loads artifacts from the transcript selected by sessionKey, runId, or taskId. */
async function loadArtifacts(query, cfg, opts = {}) {
  const resolved = resolveQuerySession(query, cfg);
  if (!resolved) return { artifacts: [] };
  const { sessionKey } = resolved;
  const scopedGlobalAgentId =
    cfg?.session?.scope === "global" && sessionKey === "global" ? resolved.agentId : void 0;
  const { storePath, entry } = scopedGlobalAgentId
    ? loadSessionEntry(sessionKey, { agentId: scopedGlobalAgentId })
    : loadSessionEntry(sessionKey);
  const sessionId = entry?.sessionId;
  if (!sessionId || !storePath)
    return {
      sessionKey,
      artifacts: [],
    };
  const artifacts = [];
  await visitSessionMessagesAsync(
    {
      agentId: resolved.agentId ?? resolveAgentIdFromSessionKey(sessionKey),
      sessionEntry: entry,
      sessionId,
      sessionKey,
      storePath,
    },
    (message, seq) => {
      collectArtifactsFromMessage({
        message,
        messageFallbackSeq: seq,
        artifacts,
        sessionKey,
        runId: query.runId,
        taskId: query.taskId,
        includeDownloadData: opts.includeDownloadData,
        downloadArtifactId: opts.downloadArtifactId,
      });
    },
    {
      mode: "full",
      reason: "artifact query transcript scan",
      cache: "skip",
    },
  );
  return {
    sessionKey,
    artifacts,
  };
}
function requireQueryable(params, respond) {
  if (params.sessionKey || params.runId || params.taskId) return true;
  respond(
    false,
    void 0,
    artifactError(
      "artifact_query_unsupported",
      "artifacts require one of sessionKey, runId, or taskId",
    ),
  );
  return false;
}
async function findArtifact(params, cfg, opts = {}) {
  const loaded = await loadArtifacts(params, cfg, opts);
  return {
    sessionKey: loaded.sessionKey,
    artifact: loaded.artifacts.find((artifact) => artifact.id === params.artifactId),
  };
}
function toSummary(artifact) {
  const { data: _dataValue, url: _url, ...summary } = artifact;
  return summary;
}
/** Gateway handlers for listing, summarizing, and downloading transcript artifacts. */
const artifactsHandlers = {
  "artifacts.list": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateArtifactsListParams, "artifacts.list", respond)) return;
    if (!requireQueryable(params, respond)) return;
    const { artifacts, sessionKey } = await loadArtifacts(params, context.getRuntimeConfig?.(), {
      includeDownloadData: false,
    });
    if (!sessionKey && (params.runId || params.taskId)) {
      respond(
        false,
        void 0,
        artifactError("artifact_scope_not_found", "no session found for artifact query"),
      );
      return;
    }
    respond(true, { artifacts: artifacts.map(toSummary) });
  },
  "artifacts.get": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateArtifactsGetParams, "artifacts.get", respond)) return;
    if (!requireQueryable(params, respond)) return;
    const { artifact } = await findArtifact(params, context.getRuntimeConfig?.(), {
      includeDownloadData: false,
    });
    if (!artifact) {
      respond(
        false,
        void 0,
        artifactError("artifact_not_found", "artifact not found", {
          artifactId: params.artifactId,
        }),
      );
      return;
    }
    respond(true, { artifact: toSummary(artifact) });
  },
  "artifacts.download": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateArtifactsDownloadParams, "artifacts.download", respond))
      return;
    if (!requireQueryable(params, respond)) return;
    const { artifact } = await findArtifact(params, context.getRuntimeConfig?.(), {
      downloadArtifactId: params.artifactId,
    });
    if (!artifact) {
      respond(
        false,
        void 0,
        artifactError("artifact_not_found", "artifact not found", {
          artifactId: params.artifactId,
        }),
      );
      return;
    }
    if (artifact.download.mode === "unsupported") {
      respond(
        false,
        void 0,
        artifactError("artifact_download_unsupported", "artifact download is unsupported", {
          artifactId: artifact.id,
        }),
      );
      return;
    }
    respond(true, {
      artifact: toSummary(artifact),
      ...(artifact.download.mode === "bytes"
        ? {
            encoding: "base64",
            data: artifact.data,
          }
        : {}),
      ...(artifact.download.mode === "url" ? { url: artifact.url } : {}),
    });
  },
};
//#endregion
export { artifactsHandlers };
