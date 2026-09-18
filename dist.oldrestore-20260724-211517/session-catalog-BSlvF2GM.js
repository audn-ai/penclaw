import { createHash } from "node:crypto";
import {
  c as resolveDefaultAgentId,
  n as listAgentIds,
  s as resolveDefaultAgentDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-BTxju7z9.js";
import {
  a as CODEX_CLI_SESSION_RESUME_COMMAND,
  t as codexControlRequest,
} from "./command-rpc-DMq_WAk0.js";
import { v as resolveCodexSupervisionAppServerRuntimeOptions } from "./config-C1imjxk6.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./routing-CwvmVRHd.js";
import { t as createCodexCliNodeConversationBindingData } from "./conversation-binding-data-xW0riOKv.js";
import "./agent-runtime-BiQiwmwD.js";
import { r as resolveExecutableFromPathEnv } from "./executable-path-BP9CqJ6T.js";
import { n as runNodePtyCommand, t as decodeNodePtyResumeParams } from "./node-host-Bq0uyz7u.js";
import { t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-Dx0ZqdxR.js";
import {
  i as isJsonObject,
  t as CODEX_INTERACTIVE_THREAD_SOURCE_KINDS,
} from "./protocol-BMifTfdW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as requestCodexAppServerClientJson } from "./request-DyCgK_5P.js";
import {
  h as sessionBindingIdentity,
  p as reclaimCurrentCodexSessionGeneration,
} from "./session-binding-CxW6VTON.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { m as resolveStorePath } from "./session-store-runtime-BwE6SlGz.js";
import {
  c as getLeasedSharedCodexAppServerClient,
  d as releaseLeasedSharedCodexAppServerClient,
} from "./shared-client-a36Mluj-.js";
import { r as importCodexThreadHistoryToTranscript } from "./transcript-mirror-CqPkRu1h.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/codex/src/app-server/thread-archive-guard.ts
const DESCENDANT_PAGE_LIMIT = 100;
const MAX_DESCENDANT_PAGES = 100;
const MAX_THREAD_ID_LENGTH = 256;
const MAX_CURSOR_LENGTH$1 = 4096;
function readBoundedId(value) {
  if (typeof value !== "string") return;
  const normalized = value.trim();
  return normalized && normalized.length <= MAX_THREAD_ID_LENGTH ? normalized : void 0;
}
function readNextCursor(value) {
  if (value === void 0 || value === null) return;
  if (typeof value !== "string" || !value.trim() || value.length > MAX_CURSOR_LENGTH$1)
    throw new Error("Codex app-server returned an invalid descendant-list cursor");
  return value;
}
/**
 * Native archive includes the spawned subtree. Enumerate that same subtree first so an
 * OpenClaw-owned descendant cannot be stopped as an undocumented side effect.
 */
async function assertCodexArchiveDescendantsUnowned(params) {
  const ancestorThreadId = readBoundedId(params.threadId);
  if (!ancestorThreadId)
    throw new Error("cannot verify Codex archive descendants for an invalid thread id");
  const seenCursors = /* @__PURE__ */ new Set();
  const seenThreadIds = /* @__PURE__ */ new Set([ancestorThreadId]);
  let cursor;
  for (let pageIndex = 0; pageIndex < MAX_DESCENDANT_PAGES; pageIndex += 1) {
    const response = await params.listPage({
      ancestorThreadId,
      archived: false,
      limit: DESCENDANT_PAGE_LIMIT,
      sortKey: "created_at",
      sortDirection: "desc",
      useStateDbOnly: true,
      ...(cursor ? { cursor } : {}),
    });
    if (!isJsonObject(response) || !Array.isArray(response.data))
      throw new Error("Codex app-server returned an invalid descendant-list response");
    if (response.data.length > DESCENDANT_PAGE_LIMIT)
      throw new Error("Codex app-server exceeded the descendant-list page limit");
    for (const value of response.data) {
      if (!isJsonObject(value))
        throw new Error("Codex app-server returned an invalid descendant thread");
      const descendantThreadId = readBoundedId(value.id);
      if (!descendantThreadId)
        throw new Error("Codex app-server returned a descendant without a valid thread id");
      if (seenThreadIds.has(descendantThreadId))
        throw new Error("Codex app-server returned a cyclic descendant thread list");
      seenThreadIds.add(descendantThreadId);
      await params.assertDescendantIdle(descendantThreadId);
      if (await params.bindingStore.hasOtherThreadOwner(descendantThreadId))
        throw new Error(
          "cannot archive a Codex thread while a spawned descendant is owned by an OpenClaw session",
        );
    }
    const nextCursor = readNextCursor(response.nextCursor);
    if (!nextCursor) return;
    if (seenCursors.has(nextCursor))
      throw new Error("Codex app-server returned a repeated descendant-list cursor");
    seenCursors.add(nextCursor);
    cursor = nextCursor;
  }
  throw new Error("Codex descendant enumeration exceeded its safety limit");
}
//#endregion
//#region extensions/codex/src/session-catalog-parsing.ts
const DEFAULT_PAGE_LIMIT = 50;
const CODEX_APP_SERVER_THREADS_CAPABILITY = "codex-app-server-threads";
const CODEX_APP_SERVER_THREADS_LIST_COMMAND = "codex.appServer.threads.list.v1";
const CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND = "codex.appServer.thread.turns.list.v1";
const CODEX_LOCAL_SESSION_HOST_ID = "gateway:local";
const NODE_INVOKE_TIMEOUT_MS = 65e3;
const MAX_SEARCH_LENGTH = 500;
const MAX_CURSOR_LENGTH = 4096;
const MAX_CURSOR_COUNT = 100;
const MAX_HOST_ID_LENGTH = 256;
const MAX_CWD_LENGTH = 4096;
const MAX_SESSION_NAME_LENGTH = 500;
const MAX_SESSION_KEY_LENGTH = 1024;
const MAX_METADATA_LENGTH = 500;
const MAX_ACTIVE_FLAGS = 16;
const MAX_TRANSCRIPT_PAGE_BYTES = 20 * 1024 * 1024;
var CatalogParamsError = class extends Error {};
function readControlCursor(value, label) {
  if (value === void 0 || value === null) return;
  if (typeof value !== "string" || !value.trim() || value.length > 4096)
    throw new CatalogParamsError(`invalid Codex session catalog ${label} cursor`);
  return value;
}
function boundedCatalogString(value, maxLength, overflow = "omit") {
  if (typeof value !== "string") return;
  const normalized = value.trim();
  if (!normalized) return;
  if (normalized.length <= maxLength) return normalized;
  return overflow === "truncate" ? truncateUtf16Safe(normalized, maxLength) : void 0;
}
function isInteractiveThreadSource(source) {
  return CODEX_INTERACTIVE_THREAD_SOURCE_KINDS.some((kind) => kind === source);
}
function toCatalogSession(thread, archived) {
  const source = thread.source;
  if (!isInteractiveThreadSource(source)) return;
  const record = thread;
  const threadId = boundedCatalogString(thread.id, 256);
  if (!threadId) return;
  const activeFlags =
    thread.status?.type === "active"
      ? thread.status.activeFlags
          ?.flatMap((flag) => {
            const normalized = boundedCatalogString(flag, 128);
            return normalized ? [normalized] : [];
          })
          .slice(0, MAX_ACTIVE_FLAGS)
      : void 0;
  const gitInfo = isRecord(record.gitInfo) ? record.gitInfo : void 0;
  const sessionId = boundedCatalogString(thread.sessionId, 256);
  const name = boundedCatalogString(thread.name, MAX_SESSION_NAME_LENGTH, "truncate");
  const cwd = boundedCatalogString(thread.cwd, MAX_CWD_LENGTH);
  const modelProvider = boundedCatalogString(record.modelProvider, MAX_METADATA_LENGTH, "truncate");
  const cliVersion = boundedCatalogString(record.cliVersion, MAX_METADATA_LENGTH, "truncate");
  const gitBranch = boundedCatalogString(gitInfo?.branch, MAX_METADATA_LENGTH, "truncate");
  return {
    threadId,
    status: thread.status?.type ?? "notLoaded",
    archived,
    ...(sessionId ? { sessionId } : {}),
    ...(thread.name === null ? { name: null } : name ? { name } : {}),
    ...(cwd ? { cwd } : {}),
    ...(activeFlags?.length ? { activeFlags } : {}),
    ...(typeof thread.createdAt === "number" && Number.isFinite(thread.createdAt)
      ? { createdAt: thread.createdAt }
      : {}),
    ...(typeof thread.updatedAt === "number" && Number.isFinite(thread.updatedAt)
      ? { updatedAt: thread.updatedAt }
      : {}),
    ...(typeof record.recencyAt === "number" && Number.isFinite(record.recencyAt)
      ? { recencyAt: record.recencyAt }
      : record.recencyAt === null
        ? { recencyAt: null }
        : {}),
    source,
    ...(modelProvider ? { modelProvider } : {}),
    ...(cliVersion ? { cliVersion } : {}),
    ...(gitBranch ? { gitBranch } : {}),
  };
}
function normalizeLimit(value, key) {
  if (value === void 0) return DEFAULT_PAGE_LIMIT;
  if (!Number.isInteger(value) || value < 1 || value > 100)
    throw new CatalogParamsError(`${key} must be an integer from 1 to 100`);
  return value;
}
function readOptionalString(params, key, maxLength) {
  const value = params[key];
  if (value === void 0) return;
  if (typeof value !== "string") throw new CatalogParamsError(`${key} must be a string`);
  const trimmed = value.trim();
  if (!trimmed) return;
  if (trimmed.length > maxLength)
    throw new CatalogParamsError(`${key} must be at most ${maxLength} characters`);
  return trimmed;
}
function requireOnlyKeys(params, allowed) {
  const unknown = Object.keys(params).find((key) => !allowed.has(key));
  if (unknown) throw new CatalogParamsError(`unknown Codex session catalog parameter: ${unknown}`);
}
function readPageParams(value) {
  if (!isRecord(value))
    throw new CatalogParamsError("Codex session catalog parameters must be an object");
  const params = value;
  requireOnlyKeys(params, /* @__PURE__ */ new Set(["cursor", "limit", "searchTerm", "cwd"]));
  const cursor = readOptionalString(params, "cursor", MAX_CURSOR_LENGTH);
  const searchTerm = readOptionalString(params, "searchTerm", MAX_SEARCH_LENGTH);
  const cwd = readOptionalString(params, "cwd", MAX_CWD_LENGTH);
  return {
    limit: normalizeLimit(params.limit, "limit"),
    ...(cursor ? { cursor } : {}),
    ...(searchTerm ? { searchTerm } : {}),
    ...(cwd ? { cwd } : {}),
  };
}
function readGatewayParams(value) {
  if (value !== void 0 && !isRecord(value))
    throw new CatalogParamsError("Codex session catalog parameters must be an object");
  const params = isRecord(value) ? value : {};
  requireOnlyKeys(
    params,
    /* @__PURE__ */ new Set(["search", "limitPerHost", "hostIds", "cursors"]),
  );
  const search = readOptionalString(params, "search", MAX_SEARCH_LENGTH);
  let hostIds;
  if (params.hostIds !== void 0) {
    if (!Array.isArray(params.hostIds) || params.hostIds.length > 100)
      throw new CatalogParamsError(`hostIds must contain at most 100 host ids`);
    hostIds = [...new Set(params.hostIds.map((hostId) => readHostId(hostId)))];
  }
  let cursors;
  if (params.cursors !== void 0) {
    if (!isRecord(params.cursors)) throw new CatalogParamsError("cursors must be an object");
    const entries = Object.entries(params.cursors);
    if (entries.length > MAX_CURSOR_COUNT)
      throw new CatalogParamsError(`cursors may contain at most ${MAX_CURSOR_COUNT} hosts`);
    cursors = {};
    for (const [hostId, cursor] of entries) {
      const normalizedHostId = hostId.trim();
      if (
        normalizedHostId.length === 0 ||
        normalizedHostId.length > MAX_HOST_ID_LENGTH ||
        (!normalizedHostId.startsWith("gateway:") && !normalizedHostId.startsWith("node:"))
      )
        throw new CatalogParamsError(`invalid Codex session catalog host id: ${hostId}`);
      if (typeof cursor !== "string" || !cursor.trim() || cursor.trim().length > 4096)
        throw new CatalogParamsError(`invalid cursor for Codex session catalog host: ${hostId}`);
      cursors[normalizedHostId] = cursor.trim();
    }
  }
  return {
    limitPerHost: normalizeLimit(params.limitPerHost, "limitPerHost"),
    ...(search ? { search } : {}),
    ...(hostIds && hostIds.length > 0 ? { hostIds } : {}),
    ...(cursors && Object.keys(cursors).length > 0 ? { cursors } : {}),
  };
}
function readHostId(value) {
  if (typeof value !== "string")
    throw new CatalogParamsError("Codex session catalog host ids must be strings");
  const hostId = value.trim();
  if (
    hostId.length === 0 ||
    hostId.length > MAX_HOST_ID_LENGTH ||
    (!hostId.startsWith("gateway:") && !hostId.startsWith("node:"))
  )
    throw new CatalogParamsError(`invalid Codex session catalog host id: ${value}`);
  return hostId;
}
function parseJsonParams(paramsJSON) {
  if (!paramsJSON?.trim()) return {};
  try {
    return JSON.parse(paramsJSON);
  } catch (error) {
    throw new Error("Codex session catalog parameters must be valid JSON", { cause: error });
  }
}
function readFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function parseOptionalCatalogString(value, field, maxLength) {
  if (value === void 0) return;
  if (typeof value !== "string" || value.length > maxLength)
    throw new Error(`Codex session catalog returned an invalid ${field}`);
  return value;
}
function parseCatalogSession(value, options = {}) {
  if (
    !isRecord(value) ||
    typeof value.threadId !== "string" ||
    !value.threadId.trim() ||
    value.threadId.length > 256 ||
    value.archived !== false
  )
    throw new Error("Codex session catalog returned an invalid session");
  const status = parseOptionalCatalogString(value.status, "status", 64);
  if (!status?.trim()) throw new Error("Codex session catalog returned an invalid status");
  if (value.activeFlags !== void 0 && !Array.isArray(value.activeFlags))
    throw new Error("Codex session catalog returned invalid active flags");
  if (Array.isArray(value.activeFlags) && value.activeFlags.length > MAX_ACTIVE_FLAGS)
    throw new Error("Codex session catalog returned too many active flags");
  const activeFlags = Array.isArray(value.activeFlags)
    ? value.activeFlags.map((entry) => {
        const flag = parseOptionalCatalogString(entry, "active flag", 128);
        if (flag === void 0)
          throw new Error("Codex session catalog returned an invalid active flag");
        return flag;
      })
    : void 0;
  const sessionId = parseOptionalCatalogString(value.sessionId, "session id", 256);
  const name =
    value.name === null
      ? null
      : parseOptionalCatalogString(value.name, "session name", MAX_SESSION_NAME_LENGTH);
  const cwd = parseOptionalCatalogString(value.cwd, "cwd", MAX_CWD_LENGTH);
  const source = parseOptionalCatalogString(value.source, "source", MAX_METADATA_LENGTH);
  const modelProvider = parseOptionalCatalogString(
    value.modelProvider,
    "model provider",
    MAX_METADATA_LENGTH,
  );
  const cliVersion = parseOptionalCatalogString(
    value.cliVersion,
    "CLI version",
    MAX_METADATA_LENGTH,
  );
  const gitBranch = parseOptionalCatalogString(value.gitBranch, "Git branch", MAX_METADATA_LENGTH);
  const openClawSessionKey = options.allowOpenClawSessionKey
    ? parseOptionalCatalogString(
        value.openClawSessionKey,
        "OpenClaw session key",
        MAX_SESSION_KEY_LENGTH,
      )
    : void 0;
  const createdAt = readFiniteNumber(value.createdAt);
  const updatedAt = readFiniteNumber(value.updatedAt);
  const recencyAt = value.recencyAt === null ? null : readFiniteNumber(value.recencyAt);
  return {
    threadId: value.threadId,
    status,
    archived: value.archived,
    ...(sessionId !== void 0 ? { sessionId } : {}),
    ...(name !== void 0 ? { name } : {}),
    ...(cwd !== void 0 ? { cwd } : {}),
    ...(activeFlags && activeFlags.length > 0 ? { activeFlags } : {}),
    ...(createdAt !== void 0 ? { createdAt } : {}),
    ...(updatedAt !== void 0 ? { updatedAt } : {}),
    ...(recencyAt !== void 0 ? { recencyAt } : {}),
    ...(source !== void 0 ? { source } : {}),
    ...(modelProvider !== void 0 ? { modelProvider } : {}),
    ...(cliVersion !== void 0 ? { cliVersion } : {}),
    ...(gitBranch !== void 0 ? { gitBranch } : {}),
    ...(openClawSessionKey !== void 0 ? { openClawSessionKey } : {}),
  };
}
function parseCatalogPage(value, options = {}) {
  if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > 100)
    throw new Error("Codex session catalog returned an invalid page");
  const nextCursor = parseOptionalCatalogString(value.nextCursor, "next cursor", MAX_CURSOR_LENGTH);
  const backwardsCursor = parseOptionalCatalogString(
    value.backwardsCursor,
    "backwards cursor",
    MAX_CURSOR_LENGTH,
  );
  return {
    sessions: value.sessions.map((session) => parseCatalogSession(session, options)),
    ...(nextCursor ? { nextCursor } : {}),
    ...(backwardsCursor ? { backwardsCursor } : {}),
  };
}
function filterCatalogPageByTitle(page, searchTerm) {
  if (!searchTerm) return page;
  return {
    ...page,
    sessions: page.sessions.filter((session) =>
      session.name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
    ),
  };
}
function unwrapNodeInvokePayload(value) {
  if (!isRecord(value)) return value;
  if (typeof value.payloadJSON === "string" && value.payloadJSON.trim())
    try {
      return JSON.parse(value.payloadJSON);
    } catch (error) {
      throw new Error("Codex node returned malformed session catalog JSON", { cause: error });
    }
  return "payload" in value ? value.payload : value;
}
function catalogErrorDetail(error) {
  if (error instanceof Error) return error.message.trim();
  if (typeof error === "string") return error.trim();
  if (error && typeof error === "object" && "message" in error) {
    const message = error.message;
    return typeof message === "string" ? message.trim() : "";
  }
  return "";
}
function catalogError(code, error) {
  const summary =
    {
      APP_SERVER_UNAVAILABLE: "Codex app-server is unavailable on this host",
      NODE_INVOKE_FAILED: "The paired node could not return its Codex session catalog",
      NODE_LIST_FAILED: "Paired nodes could not be listed",
    }[code] ?? "Codex session catalog request failed";
  const detail = code === "NODE_LIST_FAILED" ? catalogErrorDetail(error) : "";
  return {
    code,
    message: detail && detail !== summary ? `${summary}: ${detail}` : summary,
  };
}
function parseTranscriptPage(value) {
  if (
    !isRecord(value) ||
    !Array.isArray(value.data) ||
    value.data.length > 50 ||
    value.data.some(
      (turn) =>
        !isRecord(turn) || !Array.isArray(turn.items) || turn.items.some((item) => !isRecord(item)),
    )
  )
    throw new Error("Codex app-server returned an invalid transcript page");
  const nextCursor = readControlCursor(value.nextCursor, "transcript next response");
  const backwardsCursor = readControlCursor(value.backwardsCursor, "transcript backwards response");
  const page = {
    data: value.data,
    ...(nextCursor ? { nextCursor } : {}),
    ...(backwardsCursor ? { backwardsCursor } : {}),
  };
  if (Buffer.byteLength(JSON.stringify(page), "utf8") > MAX_TRANSCRIPT_PAGE_BYTES)
    throw new Error("Codex app-server transcript page exceeds the safe response size");
  return page;
}
function requireBoundThread(entry) {
  if (!entry.boundThreadId)
    throw new CatalogParamsError("Codex adoption is missing its bound thread. Retry.");
  return entry.boundThreadId;
}
//#endregion
//#region extensions/codex/src/session-catalog-node-adoption.ts
const CODEX_NODE_SESSION_KEY_PREFIX = "harness:codex:node-session:";
const continueOperations = /* @__PURE__ */ new Map();
const sessionActionTails = /* @__PURE__ */ new Map();
async function runSessionActionExclusive(threadId, run) {
  const operation = (sessionActionTails.get(threadId) ?? Promise.resolve()).then(run);
  const tail = operation.then(
    () => void 0,
    () => void 0,
  );
  sessionActionTails.set(threadId, tail);
  try {
    return await operation;
  } finally {
    if (sessionActionTails.get(threadId) === tail) sessionActionTails.delete(threadId);
  }
}
function adoptionSessionKeyRest(sessionKey) {
  const trimmed = sessionKey.trim();
  return parseAgentSessionKey(trimmed)?.rest ?? trimmed;
}
function listSupervisionAgentIds(config) {
  const defaultAgentId = resolveDefaultAgentId(config);
  return [defaultAgentId, ...listAgentIds(config).filter((agentId) => agentId !== defaultAgentId)];
}
function adoptedSourceKey(hostId, threadId) {
  return `${hostId}\u0000${threadId}`;
}
function lastTerminalTurnId(thread) {
  for (let index = (thread.turns?.length ?? 0) - 1; index >= 0; index -= 1) {
    const turn = thread.turns?.[index];
    const turnId = boundedCatalogString(turn?.id, 256);
    if (!turnId) continue;
    if (turn?.status === "completed" || turn?.status === "interrupted" || turn?.status === "failed")
      return turnId;
  }
}
function nodeAdoptionSessionKey(hostId, threadId) {
  const digest = createHash("sha256")
    .update(JSON.stringify([hostId, threadId]))
    .digest("hex");
  return `${CODEX_NODE_SESSION_KEY_PREFIX}${digest}`;
}
function readNodeSessionMarker(entry) {
  const codex = isRecord(entry.pluginExtensions?.codex) ? entry.pluginExtensions.codex : void 0;
  const marker = codex && isRecord(codex.sessionCatalog) ? codex.sessionCatalog : void 0;
  if (
    !marker ||
    typeof marker.sourceHostId !== "string" ||
    !marker.sourceHostId.startsWith("node:") ||
    typeof marker.sourceThreadId !== "string" ||
    !marker.sourceThreadId.trim() ||
    typeof marker.nodeId !== "string" ||
    !marker.nodeId.trim()
  )
    return;
  return {
    sourceHostId: marker.sourceHostId,
    sourceThreadId: marker.sourceThreadId,
    nodeId: marker.nodeId,
    ...(marker.initializing === true ? { initializing: true } : {}),
  };
}
function listNodeAdoptedSessionEntries(params) {
  const adopted = /* @__PURE__ */ new Map();
  for (const agentId of listSupervisionAgentIds(params.config ?? {}))
    for (const { entry, sessionKey } of params.runtime.agent.session.listSessionEntries({
      agentId,
    })) {
      const marker = readNodeSessionMarker(entry);
      const sessionId = entry.sessionId?.trim();
      if (
        !marker ||
        (marker.initializing === true && params.includeInitializing !== true) ||
        entry.initializationPending === true ||
        entry.agentHarnessId !== "codex" ||
        entry.modelSelectionLocked !== true ||
        !sessionId ||
        adoptionSessionKeyRest(sessionKey) !==
          nodeAdoptionSessionKey(marker.sourceHostId, marker.sourceThreadId) ||
        marker.sourceHostId !== `node:${marker.nodeId}`
      )
        continue;
      const sourceKey = adoptedSourceKey(marker.sourceHostId, marker.sourceThreadId);
      if (adopted.has(sourceKey))
        throw new Error(
          `multiple OpenClaw sessions adopt Codex thread ${marker.sourceThreadId} on ${marker.sourceHostId}`,
        );
      adopted.set(sourceKey, {
        key: sessionKey,
        sessionId,
        agentId,
        ...(marker.initializing === true ? { initializing: true } : {}),
      });
    }
  return adopted;
}
function findNodeAdoptedSessionEntry(params) {
  return listNodeAdoptedSessionEntries(params).get(
    adoptedSourceKey(params.hostId, params.threadId),
  );
}
function nodeSessionMarker(params) {
  return {
    sourceHostId: params.hostId,
    sourceThreadId: params.threadId,
    nodeId: params.nodeId,
    ...(params.initializing === true ? { initializing: true } : {}),
  };
}
async function finalizeNodeAdoptedSession(params) {
  const changedError = () =>
    new CatalogParamsError("Codex OpenClaw session changed before it could be bound. Retry.");
  let finalized;
  try {
    finalized = await params.api.runtime.agent.session.patchSessionEntry({
      sessionKey: params.adopted.key,
      readConsistency: "latest",
      preserveActivity: true,
      update: (entry) => {
        const current = readNodeSessionMarker(entry);
        if (
          entry.sessionId?.trim() !== params.adopted.sessionId ||
          entry.initializationPending === true ||
          entry.agentHarnessId !== "codex" ||
          entry.modelSelectionLocked !== true ||
          !current ||
          current.sourceHostId !== params.marker.sourceHostId ||
          current.sourceThreadId !== params.marker.sourceThreadId ||
          current.nodeId !== params.marker.nodeId
        )
          throw changedError();
        if (current.initializing !== true) return { archivedAt: void 0 };
        const codex = isRecord(entry.pluginExtensions?.codex) ? entry.pluginExtensions.codex : {};
        return {
          archivedAt: void 0,
          pluginExtensions: {
            ...entry.pluginExtensions,
            codex: {
              ...codex,
              sessionCatalog: params.marker,
            },
          },
        };
      },
    });
  } catch (error) {
    const currentEntry = params.api.runtime.agent.session.getSessionEntry({
      sessionKey: params.adopted.key,
      readConsistency: "latest",
    });
    const current = currentEntry ? readNodeSessionMarker(currentEntry) : void 0;
    if (
      currentEntry?.sessionId?.trim() === params.adopted.sessionId &&
      current?.initializing !== true &&
      current?.sourceHostId === params.marker.sourceHostId &&
      current.sourceThreadId === params.marker.sourceThreadId &&
      current.nodeId === params.marker.nodeId
    )
      return;
    throw error;
  }
  if (!finalized) throw changedError();
}
async function createOrReuseNodeAdoptedSession(params) {
  const existing = findNodeAdoptedSessionEntry({
    config: params.config,
    runtime: params.api.runtime,
    hostId: params.hostId,
    threadId: params.record.threadId,
    includeInitializing: true,
  });
  if (existing) return existing;
  const initializingMarker = {
    ...nodeSessionMarker({
      hostId: params.hostId,
      threadId: params.record.threadId,
      nodeId: params.nodeId,
    }),
    initializing: true,
  };
  try {
    const created = await params.api.runtime.agent.session.createSessionEntry({
      cfg: params.config,
      key: nodeAdoptionSessionKey(params.hostId, params.record.threadId),
      agentId: resolveDefaultAgentId(params.config),
      recoverMatchingInitialEntry: true,
      ...(params.record.name?.trim() ? { label: params.record.name.trim() } : {}),
      ...(params.record.cwd?.trim() ? { spawnedCwd: params.record.cwd.trim() } : {}),
      initialEntry: {
        agentHarnessId: "codex",
        modelSelectionLocked: true,
        pluginExtensions: { codex: { sessionCatalog: initializingMarker } },
      },
      afterCreate: async (entry) => {
        const storePath = resolveStorePath(params.config.session?.store, {
          agentId: entry.agentId,
        });
        await importCodexThreadHistoryToTranscript({
          thread: params.history.thread,
          throughTurnId: params.history.throughTurnId,
          storePath,
          sessionId: entry.sessionId,
          sessionKey: entry.key,
          agentId: entry.agentId,
          ...(params.record.cwd?.trim() ? { cwd: params.record.cwd.trim() } : {}),
          modelProvider: params.record.modelProvider,
          config: params.config,
        });
        return { pluginExtensions: { codex: { sessionCatalog: initializingMarker } } };
      },
    });
    return {
      key: created.key,
      sessionId: created.sessionId,
      agentId: created.agentId,
      initializing: true,
    };
  } catch (error) {
    const raced = findNodeAdoptedSessionEntry({
      config: params.config,
      runtime: params.api.runtime,
      hostId: params.hostId,
      threadId: params.record.threadId,
      includeInitializing: true,
    });
    if (raced) return raced;
    throw error;
  }
}
//#endregion
//#region extensions/codex/src/session-catalog-node-continue.ts
const CODEX_NODE_CONTINUE_COMMANDS = [
  CODEX_APP_SERVER_THREADS_LIST_COMMAND,
  CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
  CODEX_CLI_SESSION_RESUME_COMMAND,
];
function nodeLabel(node) {
  return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function compareNodeLabels(left, right) {
  const leftLabel = nodeLabel(left);
  const rightLabel = nodeLabel(right);
  if (leftLabel < rightLabel) return -1;
  if (leftLabel > rightLabel) return 1;
  return 0;
}
function canContinueCodexOnNode(node) {
  return (
    node.connected === true &&
    CODEX_NODE_CONTINUE_COMMANDS.every(
      (command) =>
        node.commands?.includes(command) === true &&
        node.invocableCommands?.includes(command) === true,
    )
  );
}
async function listPairedNode(params) {
  const hostId = `node:${params.node.nodeId}`;
  const common = {
    hostId,
    label: nodeLabel(params.node),
    kind: "node",
    nodeId: params.node.nodeId,
    canContinueCodex: canContinueCodexOnNode(params.node),
  };
  if (params.node.connected !== true)
    return {
      ...common,
      connected: false,
      sessions: [],
      error: {
        code: "NODE_OFFLINE",
        message: "Paired node is offline",
      },
    };
  try {
    const page = filterCatalogPageByTitle(
      parseCatalogPage(
        unwrapNodeInvokePayload(
          await params.runtime.nodes.invoke({
            nodeId: params.node.nodeId,
            command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
            params: {
              cursor: params.query.cursors?.[hostId],
              limit: params.query.limitPerHost,
              searchTerm: params.query.search,
            },
            timeoutMs: NODE_INVOKE_TIMEOUT_MS,
          }),
        ),
      ),
      params.query.search,
    );
    return {
      ...common,
      connected: true,
      ...page,
      sessions: page.sessions.map((session) => {
        const adopted = params.adoptedSessions.get(adoptedSourceKey(hostId, session.threadId));
        return adopted ? Object.assign({}, session, { openClawSessionKey: adopted.key }) : session;
      }),
    };
  } catch (error) {
    return {
      ...common,
      connected: true,
      sessions: [],
      error: catalogError("NODE_INVOKE_FAILED", error),
    };
  }
}
async function requireNodeForCodexContinue(params) {
  const nodeId = params.hostId.slice(5).trim();
  if (!nodeId || params.hostId !== `node:${nodeId}`)
    throw new CatalogParamsError("Codex session catalog hostId is invalid");
  const node = (await params.runtime.nodes.list()).nodes.find(
    (candidate) => candidate.nodeId === nodeId,
  );
  if (!node || !canContinueCodexOnNode(node))
    throw new CatalogParamsError("paired node does not permit Codex session continuation");
  return {
    node,
    nodeId,
  };
}
async function resolveNodeCodexRecord(params) {
  let cursor;
  const seenCursors = /* @__PURE__ */ new Set();
  for (let pageIndex = 0; pageIndex < 100; pageIndex += 1) {
    const page = parseCatalogPage(
      unwrapNodeInvokePayload(
        await params.runtime.nodes.invoke({
          nodeId: params.nodeId,
          command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
          params: {
            limit: 100,
            ...(cursor ? { cursor } : {}),
          },
          timeoutMs: NODE_INVOKE_TIMEOUT_MS,
        }),
      ),
    );
    const record = page.sessions.find((candidate) => candidate.threadId === params.threadId);
    if (record) return record;
    const nextCursor = page.nextCursor?.trim();
    if (!nextCursor) break;
    if (seenCursors.has(nextCursor))
      throw new CatalogParamsError("Codex session eligibility could not be verified");
    seenCursors.add(nextCursor);
    cursor = nextCursor;
  }
  throw new CatalogParamsError("Codex session is unavailable on the paired node");
}
function requireContinuableNodeRecord(record) {
  if (record.archived) throw new CatalogParamsError("Codex session is archived on the paired node");
  if (!isInteractiveThreadSource(record.source))
    throw new CatalogParamsError(
      "Codex session is not a non-archived interactive CLI or VS Code session",
    );
  if (record.status === "idle" || record.status === "notLoaded") return;
  if (record.status === "active")
    throw new CatalogParamsError(
      "Codex session is active on the paired node; wait for it to finish before continuing",
    );
  throw new CatalogParamsError("Codex session cannot be continued in its current state");
}
async function readNodeCodexHistory(params) {
  const page = parseTranscriptPage(
    unwrapNodeInvokePayload(
      await params.runtime.nodes.invoke({
        nodeId: params.nodeId,
        command: CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
        params: {
          threadId: params.record.threadId,
          limit: 50,
        },
        timeoutMs: NODE_INVOKE_TIMEOUT_MS,
      }),
    ),
  );
  const thread = {
    id: params.record.threadId,
    createdAt: params.record.createdAt ?? 0,
    modelProvider: params.record.modelProvider ?? "openai",
    turns: page.data.toReversed(),
  };
  return {
    thread,
    throughTurnId: lastTerminalTurnId(thread) ?? null,
  };
}
async function continueNodeCodexSessionInner(params) {
  const { nodeId } = await requireNodeForCodexContinue({
    runtime: params.api.runtime,
    hostId: params.hostId,
  });
  const record = await resolveNodeCodexRecord({
    runtime: params.api.runtime,
    nodeId,
    threadId: params.threadId,
  });
  requireContinuableNodeRecord(record);
  const existing = findNodeAdoptedSessionEntry({
    config: params.config,
    runtime: params.api.runtime,
    hostId: params.hostId,
    threadId: params.threadId,
    includeInitializing: true,
  });
  let adopted;
  let disposition;
  if (existing) {
    adopted = existing;
    disposition = "existing";
  } else {
    const history = await readNodeCodexHistory({
      runtime: params.api.runtime,
      nodeId,
      record,
    });
    adopted = await createOrReuseNodeAdoptedSession({
      api: params.api,
      config: params.config,
      hostId: params.hostId,
      nodeId,
      record,
      history,
    });
    disposition = "forked";
  }
  const marker = nodeSessionMarker({
    hostId: params.hostId,
    threadId: params.threadId,
    nodeId,
  });
  return {
    sessionKey: adopted.key,
    disposition,
    conversationBinding: {
      summary: "Continue this Codex session on its paired node.",
      detachHint: "Start a new chat to leave the paired-node Codex session.",
      data: createCodexCliNodeConversationBindingData({
        nodeId,
        sessionId: record.sessionId?.trim() || params.threadId,
        agentId: adopted.agentId,
        cwd: record.cwd,
      }),
    },
    afterConversationBound: async () =>
      await finalizeNodeAdoptedSession({
        api: params.api,
        adopted,
        marker,
      }),
  };
}
async function continueNodeCodexSession(params) {
  if (params.clientScopes?.includes("operator.admin") !== true)
    throw new CatalogParamsError("continuing a paired-node Codex session requires operator.admin");
  const nodeId = params.hostId.slice(5).trim();
  if (!nodeId || params.hostId !== `node:${nodeId}`)
    throw new CatalogParamsError("Codex session catalog hostId is invalid");
  const sourceKey = adoptedSourceKey(`node:${nodeId}`, params.threadId);
  const current = continueOperations.get(sourceKey);
  if (current) return await current;
  const operation = runSessionActionExclusive(sourceKey, async () =>
    continueNodeCodexSessionInner(params),
  );
  continueOperations.set(sourceKey, operation);
  try {
    return await operation;
  } finally {
    if (continueOperations.get(sourceKey) === operation) continueOperations.delete(sourceKey);
  }
}
//#endregion
//#region extensions/codex/src/session-catalog-terminal.ts
const CODEX_TERMINAL_RESUME_COMMAND = "codex.terminal.resume.v1";
function resolveLocalCodexTerminalExecutable(pathEnv = process.env.PATH ?? "") {
  return resolveExecutableFromPathEnv("codex", pathEnv);
}
function codexNodeTerminalCapability(node) {
  const commands = node.invocableCommands ?? node.commands;
  return node.connected === true && commands?.includes("codex.terminal.resume.v1") === true
    ? { canOpenTerminalCodex: true }
    : {};
}
async function requireCatalogEligibleThread(control, threadId) {
  let cursor;
  const seenCursors = /* @__PURE__ */ new Set();
  for (let pageIndex = 0; pageIndex < 100; pageIndex += 1) {
    const page = await control.listPage({
      limit: 100,
      ...(cursor ? { cursor } : {}),
    });
    const candidate = page.sessions.find((session) => session.threadId === threadId);
    if (candidate) {
      if (candidate.source === "cli" || candidate.source === "vscode") return candidate;
      throw new CatalogParamsError(
        "Codex session is not a non-archived interactive CLI or VS Code session",
      );
    }
    const nextCursor = page.nextCursor?.trim();
    if (!nextCursor)
      throw new CatalogParamsError(
        "Codex session is not a non-archived interactive CLI or VS Code session",
      );
    if (seenCursors.has(nextCursor))
      throw new CatalogParamsError("Codex session eligibility could not be verified");
    seenCursors.add(nextCursor);
    cursor = nextCursor;
  }
  throw new CatalogParamsError("Codex session eligibility could not be verified");
}
function createCodexTerminalNodeHostCommand(control) {
  return {
    command: CODEX_TERMINAL_RESUME_COMMAND,
    cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
    dangerous: false,
    duplex: true,
    isAvailable: ({ env }) => Boolean(resolveExecutableFromPathEnv("codex", env.PATH ?? "")),
    handle: async (paramsJSON, io) => {
      if (!io) throw new Error("Codex terminal command requires duplex transport");
      const resume = decodeNodePtyResumeParams(paramsJSON, (value) => {
        if (
          typeof value !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(value)
        )
          throw new CatalogParamsError("threadId must be a UUID");
        return value;
      });
      const record = await requireCatalogEligibleThread(control, resume.threadId);
      const file = resolveExecutableFromPathEnv("codex", process.env.PATH ?? "");
      if (!file) throw new Error("Codex CLI is unavailable");
      return JSON.stringify(
        await runNodePtyCommand(
          {
            file,
            args: ["resume", resume.threadId],
            cwd: record.cwd,
            cols: resume.cols,
            rows: resume.rows,
          },
          io,
        ),
      );
    },
  };
}
async function resolveNodeCatalogEligibleThread(params) {
  let cursor;
  const seenCursors = /* @__PURE__ */ new Set();
  for (let pageIndex = 0; pageIndex < 100; pageIndex += 1) {
    const raw = await params.runtime.nodes.invoke({
      nodeId: params.nodeId,
      command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
      params: {
        limit: 100,
        ...(cursor ? { cursor } : {}),
      },
      timeoutMs: NODE_INVOKE_TIMEOUT_MS,
    });
    const page = params.parseCatalogPage(unwrapNodeInvokePayload(raw));
    const record = page.sessions.find((candidate) => candidate.threadId === params.threadId);
    if (record) {
      if (isInteractiveThreadSource(record.source)) return record;
      break;
    }
    const nextCursor = page.nextCursor?.trim();
    if (!nextCursor || seenCursors.has(nextCursor)) break;
    seenCursors.add(nextCursor);
    cursor = nextCursor;
  }
  throw new CatalogParamsError(
    "Codex session is not a non-archived interactive CLI or VS Code session",
  );
}
async function openCodexCatalogTerminal(params) {
  const title = `codex resume ${params.threadId.slice(0, 8)}…`;
  if (params.hostId === "gateway:local") {
    const record = await requireCatalogEligibleThread(params.control, params.threadId);
    const executable = resolveLocalCodexTerminalExecutable();
    if (!executable) throw new CatalogParamsError("Codex CLI is unavailable");
    return {
      kind: "local",
      argv: [executable, "resume", params.threadId],
      ...(record.cwd ? { cwd: record.cwd } : {}),
      title,
    };
  }
  if (!params.hostId.startsWith("node:")) throw new CatalogParamsError("hostId is invalid");
  const nodeId = params.hostId.slice(5);
  if (
    !(await params.api.runtime.nodes.list()).nodes.find((candidate) => {
      const commands = candidate.invocableCommands ?? candidate.commands;
      return (
        candidate.nodeId === nodeId &&
        candidate.connected === true &&
        commands?.includes("codex.appServer.threads.list.v1") === true &&
        commands.includes("codex.terminal.resume.v1")
      );
    })
  )
    throw new CatalogParamsError("paired-node Codex terminal is unavailable");
  const record = await resolveNodeCatalogEligibleThread({
    runtime: params.api.runtime,
    nodeId,
    threadId: params.threadId,
    parseCatalogPage: params.parseCatalogPage,
  });
  return {
    kind: "node",
    nodeId,
    command: CODEX_TERMINAL_RESUME_COMMAND,
    paramsJSON: JSON.stringify({ threadId: params.threadId }),
    ...(record.cwd ? { cwd: record.cwd } : {}),
    title,
  };
}
//#endregion
//#region extensions/codex/src/session-catalog-transcript-item.ts
const CODEX_MESSAGE_TYPES = /* @__PURE__ */ new Map([
  ["userMessage", "userMessage"],
  ["agentMessage", "agentMessage"],
  ["reasoning", "reasoning"],
]);
const CODEX_TOOL_TYPES = /* @__PURE__ */ new Set([
  "commandExecution",
  "fileChange",
  "mcpToolCall",
  "dynamicToolCall",
  "collabAgentToolCall",
  "webSearch",
  "imageView",
  "imageGeneration",
]);
function toGenericTranscriptItem(item) {
  let type = CODEX_MESSAGE_TYPES.get(item.type);
  if (!type && CODEX_TOOL_TYPES.has(item.type))
    type = item.result !== void 0 || Boolean(item.aggregatedOutput) ? "toolResult" : "toolCall";
  type ??= "other";
  const fallback = item.title ?? item.name ?? item.tool ?? item.command ?? item.query ?? void 0;
  const resultText =
    item.aggregatedOutput ||
    (item.result === void 0 ? void 0 : JSON.stringify(item.result, null, 2));
  const changesText = Array.isArray(item.changes)
    ? item.changes.map((change) => `${change.kind}: ${change.path}`).join("\n") || void 0
    : void 0;
  const text = item.text || resultText || changesText || fallback;
  return {
    id: item.id,
    type,
    ...(text ? { text } : {}),
    raw: item,
  };
}
//#endregion
//#region extensions/codex/src/session-upstream-activity.ts
const CODEX_UPSTREAM_TURN_LIMIT = 100;
function readMarker(probe) {
  if (!isRecord(probe.marker)) return;
  const turnId = probe.marker.turnId;
  if (turnId !== null && typeof turnId !== "string") return;
  const count = probe.marker.userMessageCount;
  if (count !== void 0 && (!Number.isSafeInteger(count) || count < 0)) return;
  return {
    turnId,
    ...(count === void 0 ? {} : { userMessageCount: count }),
  };
}
function upstreamConnectionFingerprint(probe) {
  return isRecord(probe.upstreamRef) && typeof probe.upstreamRef.connectionFingerprint === "string"
    ? probe.upstreamRef.connectionFingerprint
    : void 0;
}
function classifyCodexUpstreamTurns(params) {
  const marker = readMarker(params.probe);
  const newest = params.turns[0];
  if (!marker || !newest?.id) return;
  const markerIndex =
    marker.turnId === null ? -1 : params.turns.findIndex((turn) => turn.id === marker.turnId);
  const candidateTurns = markerIndex < 0 ? params.turns : params.turns.slice(0, markerIndex + 1);
  const newestUserMessageCount = countUserMessages(newest);
  if (
    !(
      marker.turnId !== newest.id ||
      marker.userMessageCount === void 0 ||
      newestUserMessageCount > marker.userMessageCount
    )
  )
    return;
  const ownTexts = new Set(params.probe.ownRecentUserTexts);
  let humanTurns = 0;
  let occurredAt;
  for (const turn of candidateTurns) {
    const userMessages = turn.items.filter((item) => item.type === "userMessage");
    const alreadySeen =
      turn.id === marker.turnId ? (marker.userMessageCount ?? userMessages.length) : 0;
    for (const item of userMessages.slice(alreadySeen)) {
      const texts = normalizeUserMessageTexts(item);
      if (
        ownTexts.has(texts.join(" ")) ||
        (texts.length > 1 && texts.every((text) => ownTexts.has(text)))
      )
        continue;
      humanTurns += 1;
      if (occurredAt === void 0) {
        const timestampSeconds = turn.completedAt ?? turn.startedAt;
        occurredAt =
          typeof timestampSeconds === "number" && Number.isFinite(timestampSeconds)
            ? timestampSeconds * 1e3
            : (params.now ?? Date.now());
      }
    }
  }
  const activityId = `${newest.id}:${newestUserMessageCount}`;
  return {
    sessionKey: params.probe.sessionKey,
    humanTurns,
    nextMarker: {
      turnId: newest.id,
      userMessageCount: newestUserMessageCount,
    },
    ...(humanTurns > 0
      ? {
          occurredAt: occurredAt ?? params.now ?? Date.now(),
          dedupeId: activityId,
        }
      : {}),
  };
}
function countUserMessages(turn) {
  return turn.items.filter((item) => item.type === "userMessage").length;
}
function normalizeUserMessageTexts(item) {
  const typed = item;
  const contentTexts = typed.content
    ?.filter((input) => input.type === "text")
    .map((input) => input.text.trim().replace(/\s+/g, " "))
    .filter(Boolean);
  return contentTexts?.length ? contentTexts : [(typed.text ?? "").trim().replace(/\s+/g, " ")];
}
async function checkCodexUpstreamActivity(
  probes,
  control,
  resolveThreadId = async (probe) => probe.threadId,
) {
  return await control.withPinnedConnection(async (pinned) => {
    const activities = [];
    for (const probe of probes) {
      const fingerprint = upstreamConnectionFingerprint(probe);
      if (
        probe.upstreamKind !== "codex-app-server" ||
        !fingerprint ||
        fingerprint !== pinned.connectionFingerprint
      )
        continue;
      try {
        const activity = classifyCodexUpstreamTurns({
          probe,
          turns: (
            await pinned.listTurnPage({
              threadId: await resolveThreadId(probe),
              limit: CODEX_UPSTREAM_TURN_LIMIT,
              sortDirection: "desc",
              itemsView: "full",
            })
          ).data,
        });
        if (activity) activities.push(activity);
      } catch {}
    }
    return activities;
  });
}
function createChecker(params) {
  return async (probes) =>
    await checkCodexUpstreamActivity(probes, params.control, async (probe) => {
      const config = params.getRuntimeConfig();
      const sessionId = params.api.runtime.agent.session
        .getSessionEntry({
          agentId: probe.agentId,
          sessionKey: probe.sessionKey,
          readConsistency: "latest",
        })
        ?.sessionId?.trim();
      if (!sessionId) return probe.threadId;
      const binding = await params.bindingStore.read(
        sessionBindingIdentity({
          sessionId,
          sessionKey: probe.sessionKey,
          config,
        }),
      );
      return binding?.connectionScope === "supervision" &&
        binding.supervisionSourceThreadId === probe.threadId
        ? binding.threadId
        : probe.threadId;
    });
}
//#endregion
//#region extensions/codex/src/session-upstream-marker.ts
function lastIdentifiableTurn(thread, normalizeTurnId) {
  for (let index = (thread.turns?.length ?? 0) - 1; index >= 0; index -= 1) {
    const turn = thread.turns?.[index];
    const turnId = normalizeTurnId(turn?.id);
    if (turn && turnId)
      return {
        ...turn,
        id: turnId,
      };
  }
}
function codexUpstreamBaseline(thread, normalizeTurnId) {
  const turn = lastIdentifiableTurn(thread, normalizeTurnId);
  return {
    turnId: turn?.id ?? null,
    userMessageCount: turn?.items.filter((item) => item.type === "userMessage").length ?? 0,
  };
}
function codexLastTerminalTurnId(thread, normalizeTurnId) {
  for (let index = (thread.turns?.length ?? 0) - 1; index >= 0; index -= 1) {
    const turn = thread.turns?.[index];
    const turnId = normalizeTurnId(turn?.id);
    if (!turn || !turnId) continue;
    if (turn.status === "completed" || turn.status === "interrupted" || turn.status === "failed")
      return turnId;
  }
}
/** Build the upstream link seed for a continued Codex session, if a baseline exists. */
function codexUpstreamContinueResult(sessionKey, threadId, baseline) {
  if (!baseline) return { sessionKey };
  return {
    sessionKey,
    upstream: {
      kind: "codex-app-server",
      ref: {
        connectionFingerprint: baseline.connectionFingerprint,
        threadId,
      },
      marker: {
        turnId: baseline.turnId,
        userMessageCount: baseline.userMessageCount,
      },
    },
  };
}
//#endregion
//#region extensions/codex/src/session-catalog.ts
const boundCatalogSessionId = (value) => boundedCatalogString(value, 256);
const CODEX_SUPERVISION_SESSION_KEY_PREFIX = "harness:codex:supervision:";
function createCodexSessionCatalogControlFromRequests(params) {
  return {
    ...(params.connectionFingerprint
      ? { connectionFingerprint: params.connectionFingerprint }
      : {}),
    withPinnedConnection: params.withPinnedConnection,
    async listPage(pageParams) {
      const limit = normalizeLimit(pageParams.limit, "limit");
      const search = pageParams.searchTerm?.trim().toLocaleLowerCase() || void 0;
      const cwd = pageParams.cwd?.trim() || void 0;
      const maxPages = search ? 20 : 1;
      const sessions = [];
      let cursor = readControlCursor(pageParams.cursor, "request");
      let nextCursor;
      let backwardsCursor;
      const seenCursors = new Set(cursor ? [cursor] : []);
      const requests = params.createRequestSnapshot();
      const deadline = params.now() + requests.requestTimeoutMs;
      for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
        const remaining = limit - sessions.length;
        const remainingTimeoutMs = Math.ceil(deadline - params.now());
        if (remainingTimeoutMs <= 0) throw new Error("Codex session catalog listing timed out");
        const response = await requests.listThreads(
          {
            archived: false,
            limit: remaining,
            modelProviders: [],
            sortKey: "recency_at",
            sortDirection: "desc",
            sourceKinds: [...CODEX_INTERACTIVE_THREAD_SOURCE_KINDS],
            ...(cwd ? { cwd } : {}),
            ...(cursor ? { cursor } : {}),
          },
          remainingTimeoutMs,
        );
        if (pageIndex === 0)
          backwardsCursor = readControlCursor(response.backwardsCursor, "backwards response");
        sessions.push(
          ...response.data
            .flatMap((thread) => {
              const session = toCatalogSession(thread, false);
              return session ? [session] : [];
            })
            .filter((session) => !search || session.name?.toLocaleLowerCase().includes(search)),
        );
        nextCursor = readControlCursor(response.nextCursor, "next response");
        if (!nextCursor || sessions.length >= limit) break;
        if (seenCursors.has(nextCursor))
          throw new Error("Codex session catalog returned a repeated search cursor");
        seenCursors.add(nextCursor);
        cursor = nextCursor;
      }
      return {
        sessions,
        ...(nextCursor ? { nextCursor } : {}),
        ...(backwardsCursor ? { backwardsCursor } : {}),
      };
    },
    async listDescendantPage(listParams) {
      const requests = params.createRequestSnapshot();
      return await requests.listThreads(listParams, requests.requestTimeoutMs);
    },
    async readThread(threadId, includeTurns = false) {
      return await params.createRequestSnapshot().readThread(threadId, includeTurns);
    },
    async listTurnPage(listParams) {
      return await params.createRequestSnapshot().listThreadTurns(listParams);
    },
    async archiveThread(threadId) {
      await params.createRequestSnapshot().archiveThread(threadId);
    },
  };
}
/** Builds the passive catalog over the Codex plugin's canonical shared client. */
function createCodexSessionCatalogControl(params) {
  const now = params.now ?? Date.now;
  const getPluginConfig = () => params.getPluginConfig();
  const createRequestSnapshot = () => {
    const pluginConfig = getPluginConfig();
    const runtime = resolveCodexSupervisionAppServerRuntimeOptions({ pluginConfig });
    const requestOptions = {
      config: structuredClone(params.getRuntimeConfig()),
      startOptions: structuredClone(runtime.start),
    };
    return {
      requestTimeoutMs: runtime.requestTimeoutMs,
      listThreads: async (listParams, timeoutMs) =>
        await codexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listThreads, listParams, {
          ...requestOptions,
          timeoutMs,
        }),
      readThread: async (threadId, includeTurns) =>
        (
          await codexControlRequest(
            pluginConfig,
            CODEX_CONTROL_METHODS.readThread,
            {
              threadId,
              includeTurns,
            },
            requestOptions,
          )
        ).thread,
      listThreadTurns: async (listParams) =>
        await codexControlRequest(
          pluginConfig,
          CODEX_CONTROL_METHODS.listThreadTurns,
          listParams,
          requestOptions,
        ),
      archiveThread: async (threadId) => {
        await codexControlRequest(
          pluginConfig,
          CODEX_CONTROL_METHODS.archiveThread,
          { threadId },
          requestOptions,
        );
      },
    };
  };
  const withPinnedConnection = async (run) => {
    const runtime = resolveCodexSupervisionAppServerRuntimeOptions({
      pluginConfig: getPluginConfig(),
    });
    const runtimeConfig = structuredClone(params.getRuntimeConfig());
    const client = await getLeasedSharedCodexAppServerClient({
      config: runtimeConfig,
      startOptions: structuredClone(runtime.start),
      timeoutMs: runtime.requestTimeoutMs,
    });
    try {
      const requests = {
        requestTimeoutMs: runtime.requestTimeoutMs,
        listThreads: async (listParams, timeoutMs) =>
          await requestCodexAppServerClientJson({
            client,
            method: CODEX_CONTROL_METHODS.listThreads,
            requestParams: listParams,
            config: runtimeConfig,
            timeoutMs,
          }),
        readThread: async (threadId, includeTurns) =>
          (
            await requestCodexAppServerClientJson({
              client,
              method: CODEX_CONTROL_METHODS.readThread,
              requestParams: {
                threadId,
                includeTurns,
              },
              config: runtimeConfig,
              timeoutMs: runtime.requestTimeoutMs,
            })
          ).thread,
        listThreadTurns: async (listParams) =>
          await requestCodexAppServerClientJson({
            client,
            method: CODEX_CONTROL_METHODS.listThreadTurns,
            requestParams: listParams,
            config: runtimeConfig,
            timeoutMs: runtime.requestTimeoutMs,
          }),
        archiveThread: async (threadId) => {
          await requestCodexAppServerClientJson({
            client,
            method: CODEX_CONTROL_METHODS.archiveThread,
            requestParams: { threadId },
            config: runtimeConfig,
            timeoutMs: runtime.requestTimeoutMs,
          });
        },
      };
      const pinnedControl = createCodexSessionCatalogControlFromRequests({
        connectionFingerprint: buildCodexAppServerConnectionFingerprint(
          runtime,
          resolveDefaultAgentDir(runtimeConfig ?? {}),
        ),
        createRequestSnapshot: () => requests,
        now,
        withPinnedConnection: async (nestedRun) => await nestedRun(pinnedControl),
      });
      return await run(pinnedControl);
    } finally {
      releaseLeasedSharedCodexAppServerClient(client);
    }
  };
  return createCodexSessionCatalogControlFromRequests({
    createRequestSnapshot,
    now,
    withPinnedConnection,
  });
}
async function listGatewayHost(params) {
  try {
    const page = parseCatalogPage(
      await params.control.listPage({
        limit: params.query.limitPerHost,
        ...(params.query.cursors?.["gateway:local"]
          ? { cursor: params.query.cursors[CODEX_LOCAL_SESSION_HOST_ID] }
          : {}),
        ...(params.query.search ? { searchTerm: params.query.search } : {}),
      }),
    );
    const adoptedSessions = await listAdoptedSessionEntries({
      bindingStore: params.bindingStore,
      config: params.config,
      runtime: params.runtime,
    });
    return {
      hostId: CODEX_LOCAL_SESSION_HOST_ID,
      label: "Local Codex",
      kind: "gateway",
      connected: true,
      ...page,
      sessions: page.sessions.map((session) => {
        const adopted = adoptedSessions.get(session.threadId);
        return adopted ? Object.assign({}, session, { openClawSessionKey: adopted.key }) : session;
      }),
    };
  } catch (error) {
    return {
      hostId: CODEX_LOCAL_SESSION_HOST_ID,
      label: "Local Codex",
      kind: "gateway",
      connected: false,
      sessions: [],
      error: catalogError("APP_SERVER_UNAVAILABLE", error),
    };
  }
}
/** Lists Gateway-local and paired-node Codex sessions with per-host failures. */
async function listCodexSessionCatalog(params) {
  const query = readGatewayParams(params.query);
  const requestedHostIds = query.hostIds ? new Set(query.hostIds) : void 0;
  const localHosts =
    !requestedHostIds || requestedHostIds.has("gateway:local")
      ? [
          listGatewayHost({
            bindingStore: params.bindingStore,
            config: params.config,
            control: params.control,
            query,
            runtime: params.runtime,
          }),
        ]
      : [];
  if (!(!requestedHostIds || query.hostIds?.some((hostId) => hostId.startsWith("node:"))))
    return { hosts: await Promise.all(localHosts) };
  let nodes;
  try {
    nodes = (await params.runtime.nodes.list()).nodes
      .filter(
        (node) =>
          node.commands?.includes("codex.appServer.threads.list.v1") &&
          (!requestedHostIds || requestedHostIds.has(`node:${node.nodeId}`)),
      )
      .slice(0, 100 - localHosts.length);
  } catch (error) {
    return {
      hosts: [
        ...(await Promise.all(localHosts)),
        {
          hostId: "node:registry",
          label: "Paired nodes",
          kind: "node",
          connected: false,
          sessions: [],
          error: catalogError("NODE_LIST_FAILED", error),
        },
      ],
    };
  }
  const adoptedNodeSessions = listNodeAdoptedSessionEntries({
    config: params.config,
    runtime: params.runtime,
  });
  const nodeHosts = nodes.toSorted(compareNodeLabels).map(async (node) => {
    const host = await listPairedNode({
      runtime: params.runtime,
      node,
      query,
      adoptedSessions: adoptedNodeSessions,
    });
    return Object.assign(host, codexNodeTerminalCapability(node));
  });
  return { hosts: await Promise.all([...localHosts, ...nodeHosts]) };
}
/** Builds the node-local read-only Codex app-server catalog command. */
function createCodexSessionCatalogNodeHostCommands(control) {
  return [
    {
      command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
      cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
      dangerous: false,
      handle: async (paramsJSON) => {
        const pageParams = readPageParams(parseJsonParams(paramsJSON));
        try {
          const page = filterCatalogPageByTitle(
            parseCatalogPage(await control.listPage(pageParams)),
            pageParams.searchTerm,
          );
          return JSON.stringify(page);
        } catch {
          throw new Error("Codex app-server catalog is unavailable");
        }
      },
    },
    {
      command: CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
      cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
      dangerous: false,
      handle: async (paramsJSON) => {
        const action = readNodeTranscriptParams(parseJsonParams(paramsJSON));
        try {
          await requireCatalogEligibleThread(control, action.threadId);
          const page = parseTranscriptPage(
            await control.listTurnPage({
              threadId: action.threadId,
              limit: action.limit,
              sortDirection: "desc",
              itemsView: "full",
              ...(action.cursor ? { cursor: action.cursor } : {}),
            }),
          );
          return JSON.stringify(page);
        } catch (error) {
          if (error instanceof CatalogParamsError) throw error;
          throw new Error("Codex app-server transcript is unavailable", { cause: error });
        }
      },
    },
    createCodexTerminalNodeHostCommand(control),
  ];
}
function readNodeTranscriptParams(value) {
  if (!isRecord(value))
    throw new CatalogParamsError("Codex session read parameters must be an object");
  requireOnlyKeys(value, /* @__PURE__ */ new Set(["threadId", "cursor", "limit"]));
  const threadId = readOptionalString(value, "threadId", 256);
  if (!threadId) throw new CatalogParamsError("threadId is required");
  const cursor = readOptionalString(value, "cursor", MAX_CURSOR_LENGTH);
  return {
    threadId,
    limit: readBoundedLimit(value.limit, "limit", 20, 50),
    ...(cursor ? { cursor } : {}),
  };
}
function readBoundedLimit(value, key, fallback, max) {
  if (value === void 0) return fallback;
  if (!Number.isInteger(value) || value < 1 || value > max)
    throw new CatalogParamsError(`${key} must be an integer from 1 to ${max}`);
  return value;
}
function flattenTranscriptPageDesc(page) {
  return page.data.flatMap((turn) => turn.items.toReversed());
}
/** Reads the persisted transcript for a Gateway-local or paired-node Codex session. */
async function readCodexSessionTranscript(params) {
  if (params.hostId === "gateway:local") {
    await requireCatalogEligibleThread(params.control, params.threadId);
    const page = parseTranscriptPage(
      await params.control.listTurnPage({
        threadId: params.threadId,
        limit: params.limit,
        sortDirection: "desc",
        itemsView: "full",
        ...(params.cursor ? { cursor: params.cursor } : {}),
      }),
    );
    return {
      hostId: params.hostId,
      label: "Local Codex",
      threadId: params.threadId,
      items: flattenTranscriptPageDesc(page),
      ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
      ...(page.backwardsCursor ? { backwardsCursor: page.backwardsCursor } : {}),
    };
  }
  const nodeId = params.hostId.slice(5);
  const node = (await params.runtime.nodes.list()).nodes.find(
    (candidate) =>
      candidate.nodeId === nodeId &&
      candidate.connected === true &&
      candidate.commands?.includes("codex.appServer.thread.turns.list.v1"),
  );
  if (!node)
    throw new CatalogParamsError("paired-node Codex session host is offline or unavailable");
  const page = parseTranscriptPage(
    unwrapNodeInvokePayload(
      await params.runtime.nodes.invoke({
        nodeId,
        command: CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
        params: {
          threadId: params.threadId,
          limit: params.limit,
          ...(params.cursor ? { cursor: params.cursor } : {}),
        },
        timeoutMs: NODE_INVOKE_TIMEOUT_MS,
      }),
    ),
  );
  return {
    hostId: params.hostId,
    label: nodeLabel(node),
    threadId: params.threadId,
    items: flattenTranscriptPageDesc(page),
    ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
    ...(page.backwardsCursor ? { backwardsCursor: page.backwardsCursor } : {}),
  };
}
function requireIdleThread(thread, action) {
  if (
    thread.status?.type === "idle" ||
    (action === "archive" && thread.status?.type === "notLoaded")
  )
    return;
  if (thread.status?.type === "active")
    throw new CatalogParamsError(
      `Codex session is active in this App Server; wait for it to finish before ${action === "continue" ? "starting a branch" : "archiving"}`,
    );
  throw new CatalogParamsError(
    action === "archive"
      ? "Codex session cannot be archived in its current state"
      : "Codex session cannot start a branch in its current state",
  );
}
function adoptionSessionKey(threadId) {
  const digest = createHash("sha256").update(threadId).digest("hex");
  return `${CODEX_SUPERVISION_SESSION_KEY_PREFIX}${digest}`;
}
function isAdoptionSessionKeyForThread(sessionKey, threadId) {
  return adoptionSessionKeyRest(sessionKey) === adoptionSessionKey(threadId);
}
async function listAdoptedSessionEntries(params) {
  const adopted = /* @__PURE__ */ new Map();
  for (const agentId of listSupervisionAgentIds(params.config ?? {}))
    for (const { entry, sessionKey } of params.runtime.agent.session.listSessionEntries({
      agentId,
    })) {
      const sessionKeyRest = adoptionSessionKeyRest(sessionKey);
      if (
        !sessionKeyRest.startsWith(CODEX_SUPERVISION_SESSION_KEY_PREFIX) ||
        entry.initializationPending === true ||
        entry.agentHarnessId !== "codex" ||
        entry.modelSelectionLocked !== true
      )
        continue;
      const sessionId = entry.sessionId?.trim();
      if (!sessionId) continue;
      const binding = await params.bindingStore.read(
        sessionBindingIdentity({
          sessionId,
          sessionKey,
          config: params.config,
        }),
      );
      const sourceThreadId = binding?.supervisionSourceThreadId?.trim();
      const boundThreadId = binding?.threadId.trim();
      if (
        binding?.connectionScope !== "supervision" ||
        !sourceThreadId ||
        !boundThreadId ||
        sessionKeyRest !== adoptionSessionKey(sourceThreadId)
      )
        continue;
      if (adopted.has(sourceThreadId))
        throw new Error(`multiple OpenClaw sessions adopt Codex thread ${sourceThreadId}`);
      adopted.set(sourceThreadId, {
        key: sessionKey,
        sessionId,
        agentId,
        boundThreadId,
      });
    }
  return adopted;
}
async function findAdoptedSessionEntry(params) {
  return (await listAdoptedSessionEntries(params)).get(params.threadId);
}
var CodexAdoptionBindingCleanupError = class extends AggregateError {};
async function clearCreatedAdoptionBinding(params) {
  let cleared = false;
  let clearError;
  try {
    cleared = await params.bindingStore.mutate(params.identity, {
      kind: "clear",
      threadId: params.sourceThreadId,
      expectedPendingSupervisionBranch: params.expectedPending,
    });
  } catch (error) {
    clearError = error;
  }
  if (cleared) return;
  let current;
  try {
    current = await params.bindingStore.read(params.identity);
  } catch (readError) {
    throw new CodexAdoptionBindingCleanupError(
      [params.cause, ...(clearError ? [clearError] : []), readError],
      `OpenClaw session creation failed and the Codex binding could not be verified for ${params.sourceThreadId}`,
    );
  }
  if (!matchesPendingSupervisionOwner(current, params.expectedPending)) return;
  throw new CodexAdoptionBindingCleanupError(
    [params.cause, ...(clearError ? [clearError] : [])],
    `OpenClaw session creation failed and the Codex binding could not be cleared for ${params.sourceThreadId}`,
  );
}
function matchesPendingAdoptionBinding(binding, expected) {
  const historyCoveredThrough = binding?.historyCoveredThrough;
  return (
    binding?.threadId === expected.sourceThreadId &&
    binding.connectionScope === "supervision" &&
    binding.supervisionSourceThreadId === expected.sourceThreadId &&
    binding.cwd === expected.cwd &&
    binding.conversationSourceTransferComplete === true &&
    binding.preserveNativeModel === true &&
    binding.pendingSupervisionBranch?.sourceThreadId === expected.sourceThreadId &&
    binding.pendingSupervisionBranch.connectionFingerprint === expected.connectionFingerprint &&
    binding.pendingSupervisionBranch.lastTurnId === expected.lastTurnId &&
    (binding.pendingSupervisionBranch.cleanupThreadIds?.length ?? 0) === 0 &&
    typeof historyCoveredThrough === "string" &&
    Number.isFinite(Date.parse(historyCoveredThrough))
  );
}
function matchesPendingSupervisionOwner(binding, expected) {
  const pending = binding?.pendingSupervisionBranch;
  const cleanupThreadIds = pending?.cleanupThreadIds ?? [];
  const expectedCleanupThreadIds = expected.cleanupThreadIds ?? [];
  return (
    binding?.threadId === expected.sourceThreadId &&
    binding.connectionScope === "supervision" &&
    binding.supervisionSourceThreadId === expected.sourceThreadId &&
    pending?.sourceThreadId === expected.sourceThreadId &&
    pending.connectionFingerprint === expected.connectionFingerprint &&
    pending.lastTurnId === expected.lastTurnId &&
    cleanupThreadIds.length === expectedCleanupThreadIds.length &&
    cleanupThreadIds.every((threadId, index) => threadId === expectedCleanupThreadIds[index])
  );
}
async function ensurePendingAdoptionBinding(params) {
  const pending = {
    sourceThreadId: params.sourceThreadId,
    connectionFingerprint: params.connectionFingerprint,
    ...(params.lastTurnId ? { lastTurnId: params.lastTurnId } : {}),
  };
  if (
    !(await reclaimCurrentCodexSessionGeneration({
      bindingStore: params.bindingStore,
      identity: params.identity,
      config: params.config,
    }))
  )
    throw new Error(`failed to claim the OpenClaw session generation for ${params.sourceThreadId}`);
  const existing = await params.bindingStore.read(params.identity);
  if (existing) {
    if (matchesPendingAdoptionBinding(existing, params)) return;
    throw new Error(`OpenClaw session is already bound to Codex thread ${existing.threadId}`);
  }
  const binding = {
    threadId: params.sourceThreadId,
    connectionScope: "supervision",
    supervisionSourceThreadId: params.sourceThreadId,
    cwd: params.cwd,
    historyCoveredThrough: /* @__PURE__ */ new Date().toISOString(),
    conversationSourceTransferComplete: true,
    preserveNativeModel: true,
    pendingSupervisionBranch: pending,
  };
  let stored;
  try {
    stored = await params.bindingStore.mutate(params.identity, {
      kind: "set",
      if: { kind: "absent" },
      binding,
    });
  } catch (error) {
    if (matchesPendingAdoptionBinding(await params.bindingStore.read(params.identity), params))
      return;
    throw error;
  }
  if (stored) return;
  if (!matchesPendingAdoptionBinding(await params.bindingStore.read(params.identity), params))
    throw new Error(`failed to bind OpenClaw session to Codex thread ${params.sourceThreadId}`);
}
async function createOrReuseAdoptedSession(params) {
  const existing = await findAdoptedSessionEntry({
    bindingStore: params.bindingStore,
    config: params.config,
    runtime: params.api.runtime,
    threadId: params.sourceThread.id,
  });
  if (existing) return existing;
  let createdBindingIdentity;
  let createdPendingBinding;
  try {
    const label = params.sourceThread.name?.trim() || void 0;
    const spawnedCwd = params.sourceThread.cwd?.trim() || void 0;
    const pendingLastTurnId = codexLastTerminalTurnId(params.sourceThread, boundCatalogSessionId);
    const marker = { sourceThreadId: params.sourceThread.id };
    const created = await params.api.runtime.agent.session.createSessionEntry({
      cfg: params.config,
      key: adoptionSessionKey(params.sourceThread.id),
      agentId: resolveDefaultAgentId(params.config),
      recoverMatchingInitialEntry: true,
      ...(label ? { label } : {}),
      ...(spawnedCwd ? { spawnedCwd } : {}),
      initialEntry: {
        agentHarnessId: "codex",
        modelSelectionLocked: true,
        pluginExtensions: {
          codex: {
            supervision: {
              ...marker,
              initializing: true,
              modelLocked: true,
            },
          },
        },
      },
      afterCreate: async (entry) => {
        createdBindingIdentity = sessionBindingIdentity({
          sessionId: entry.sessionId,
          sessionKey: entry.key,
          config: params.config,
        });
        const storePath = resolveStorePath(params.config.session?.store, {
          agentId: entry.agentId,
        });
        await importCodexThreadHistoryToTranscript({
          thread: params.sourceThread,
          throughTurnId: pendingLastTurnId ?? null,
          storePath,
          sessionId: entry.sessionId,
          sessionKey: entry.key,
          agentId: entry.agentId,
          ...(spawnedCwd ? { cwd: spawnedCwd } : {}),
          modelProvider: params.sourceThread.modelProvider,
          config: params.config,
        });
        createdPendingBinding = {
          sourceThreadId: params.sourceThread.id,
          connectionFingerprint: params.connectionFingerprint,
          ...(pendingLastTurnId ? { lastTurnId: pendingLastTurnId } : {}),
        };
        await ensurePendingAdoptionBinding({
          bindingStore: params.bindingStore,
          config: params.config,
          identity: createdBindingIdentity,
          sourceThreadId: params.sourceThread.id,
          connectionFingerprint: params.connectionFingerprint,
          cwd: spawnedCwd ?? "",
          ...(pendingLastTurnId ? { lastTurnId: pendingLastTurnId } : {}),
        });
        return {
          pluginExtensions: {
            codex: {
              supervision: {
                ...marker,
                modelLocked: true,
              },
            },
          },
        };
      },
    });
    return {
      key: created.key,
      sessionId: created.sessionId,
      agentId: created.agentId,
      boundThreadId: params.sourceThread.id,
    };
  } catch (error) {
    let raced = await findAdoptedSessionEntry({
      bindingStore: params.bindingStore,
      config: params.config,
      runtime: params.api.runtime,
      threadId: params.sourceThread.id,
    });
    if (raced) return raced;
    if (createdBindingIdentity && createdPendingBinding) {
      await clearCreatedAdoptionBinding({
        bindingStore: params.bindingStore,
        identity: createdBindingIdentity,
        sourceThreadId: params.sourceThread.id,
        expectedPending: createdPendingBinding,
        cause: error,
      });
      raced = await findAdoptedSessionEntry({
        bindingStore: params.bindingStore,
        config: params.config,
        runtime: params.api.runtime,
        threadId: params.sourceThread.id,
      });
      if (raced) return raced;
    }
    throw error;
  }
}
async function continueLocalCodexSessionInner(params) {
  await requireCatalogEligibleThread(params.control, params.threadId);
  const existing = await findAdoptedSessionEntry({
    bindingStore: params.bindingStore,
    config: params.config,
    runtime: params.api.runtime,
    threadId: params.threadId,
  });
  if (existing) {
    const boundThreadId = requireBoundThread(existing);
    const boundThread = await params.control.readThread(boundThreadId, true);
    if (boundThread.id !== boundThreadId)
      throw new Error("Codex app-server returned a different thread than requested");
    const changedError = () =>
      new CatalogParamsError("Codex OpenClaw session changed before it could be opened. Retry.");
    if (
      !(await params.api.runtime.agent.session.patchSessionEntry({
        sessionKey: existing.key,
        readConsistency: "latest",
        preserveActivity: true,
        update: (entry) => {
          if (
            entry.sessionId?.trim() !== existing.sessionId ||
            entry.initializationPending === true ||
            entry.agentHarnessId !== "codex" ||
            entry.modelSelectionLocked !== true
          )
            throw changedError();
          return { archivedAt: void 0 };
        },
      }))
    )
      throw changedError();
    const connectionFingerprint = params.control.connectionFingerprint;
    if (connectionFingerprint)
      params.onContinued?.({
        connectionFingerprint,
        ...codexUpstreamBaseline(boundThread, boundCatalogSessionId),
      });
    return {
      sessionKey: existing.key,
      disposition: "existing",
    };
  }
  const sourceThread = await params.control.readThread(params.threadId, true);
  if (sourceThread.id !== params.threadId)
    throw new Error("Codex app-server returned a different thread than requested");
  if (sourceThread.status?.type !== "notLoaded") requireIdleThread(sourceThread, "continue");
  const connectionFingerprint = params.control.connectionFingerprint;
  if (!connectionFingerprint)
    throw new Error("Codex Continue requires a pinned app-server connection");
  const adopted = await createOrReuseAdoptedSession({
    api: params.api,
    bindingStore: params.bindingStore,
    config: params.config,
    sourceThread,
    connectionFingerprint,
  });
  const boundThreadId = requireBoundThread(adopted);
  const baselineThread =
    boundThreadId === sourceThread.id
      ? sourceThread
      : await params.control.readThread(boundThreadId, true);
  if (baselineThread.id !== boundThreadId)
    throw new Error("Codex app-server returned a different thread than requested");
  params.onContinued?.({
    connectionFingerprint,
    ...codexUpstreamBaseline(baselineThread, boundCatalogSessionId),
  });
  return {
    sessionKey: adopted.key,
    disposition: "forked",
  };
}
/** Creates one locked OpenClaw branch whose first harness run forks the Codex source. */
async function continueLocalCodexSession(params) {
  const sourceKey = adoptedSourceKey(CODEX_LOCAL_SESSION_HOST_ID, params.threadId);
  const current = continueOperations.get(sourceKey);
  if (current) return await current;
  const operation = runSessionActionExclusive(sourceKey, async () =>
    params.control.withPinnedConnection(async (control) =>
      continueLocalCodexSessionInner({
        ...params,
        control,
      }),
    ),
  );
  continueOperations.set(sourceKey, operation);
  try {
    return await operation;
  } finally {
    if (continueOperations.get(sourceKey) === operation) continueOperations.delete(sourceKey);
  }
}
async function assertNoPendingSupervisionBranch(params) {
  const adoptedEntries = listSupervisionAgentIds(params.config)
    .flatMap((agentId) => params.runtime.agent.session.listSessionEntries({ agentId }))
    .filter((candidate) => isAdoptionSessionKeyForThread(candidate.sessionKey, params.threadId));
  for (const adopted of adoptedEntries) {
    if (adopted.entry.initializationPending === true)
      throw new CatalogParamsError(
        "Codex session cannot be archived while its OpenClaw branch is initializing",
      );
    const sessionId = adopted.entry.sessionId?.trim();
    if (!sessionId) continue;
    const binding = await params.bindingStore.read(
      sessionBindingIdentity({
        sessionId,
        sessionKey: adopted.sessionKey,
        config: params.config,
      }),
    );
    if (
      binding?.connectionScope === "supervision" &&
      binding.supervisionSourceThreadId === params.threadId &&
      binding.pendingSupervisionBranch?.sourceThreadId === params.threadId
    )
      throw new CatalogParamsError(
        "Codex session cannot be archived until its OpenClaw branch starts",
      );
  }
}
/** Archives one inactive Gateway-local Codex thread after a fresh status read. */
async function archiveLocalCodexSession(params) {
  return await runSessionActionExclusive(
    adoptedSourceKey(CODEX_LOCAL_SESSION_HOST_ID, params.threadId),
    async () => {
      return await params.bindingStore.withThreadArchiveFence(async () => {
        return await params.control.withPinnedConnection(async (control) => {
          await requireCatalogEligibleThread(control, params.threadId);
          await assertNoPendingSupervisionBranch(params);
          const thread = await control.readThread(params.threadId, false);
          if (thread.id !== params.threadId)
            throw new Error("Codex app-server returned a different thread than requested");
          requireIdleThread(thread, "archive");
          if (await params.bindingStore.hasOtherThreadOwner(params.threadId))
            throw new CatalogParamsError(
              "Codex session cannot be archived while it is attached to an OpenClaw session",
            );
          await assertCodexArchiveDescendantsUnowned({
            bindingStore: params.bindingStore,
            threadId: params.threadId,
            listPage: (request) => control.listDescendantPage(request),
            assertDescendantIdle: async (descendantThreadId) => {
              const descendant = await control.readThread(descendantThreadId, false);
              if (descendant.id !== descendantThreadId)
                throw new Error("Codex app-server returned a different descendant than requested");
              requireIdleThread(descendant, "archive");
            },
          });
          await control.archiveThread(params.threadId);
          return { archived: true };
        });
      });
    },
  );
}
/** Allows read-only catalog and transcript commands on supported paired-node platforms. */
function createCodexSessionCatalogNodeInvokePolicies() {
  return [
    {
      commands: [
        CODEX_APP_SERVER_THREADS_LIST_COMMAND,
        CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
        CODEX_TERMINAL_RESUME_COMMAND,
      ],
      defaultPlatforms: ["macos", "linux", "windows"],
      handle: (context) =>
        context.command === "codex.terminal.resume.v1" ? { ok: true } : context.invokeNode(),
    },
  ];
}
function toGenericCatalogHost(host, localTerminalAvailable) {
  const local = host.hostId === CODEX_LOCAL_SESSION_HOST_ID;
  return {
    hostId: host.hostId,
    label: host.label,
    kind: host.kind,
    connected: host.connected,
    ...(host.nodeId ? { nodeId: host.nodeId } : {}),
    sessions: host.sessions.map((session) => {
      const continuableStatus =
        !session.archived && (session.status === "idle" || session.status === "notLoaded");
      const canContinue =
        (local || host.canContinueCodex === true) &&
        continuableStatus &&
        isInteractiveThreadSource(session.source);
      const canArchive = local && continuableStatus && isInteractiveThreadSource(session.source);
      const canOpenTerminal =
        isInteractiveThreadSource(session.source) &&
        (local ? localTerminalAvailable : host.canOpenTerminalCodex === true);
      return {
        threadId: session.threadId,
        ...(session.name != null ? { name: session.name } : {}),
        ...(session.cwd ? { cwd: session.cwd } : {}),
        status: session.status,
        ...(session.createdAt != null ? { createdAt: session.createdAt } : {}),
        ...(session.updatedAt != null ? { updatedAt: session.updatedAt } : {}),
        ...(session.recencyAt != null ? { recencyAt: session.recencyAt } : {}),
        ...(session.source ? { source: session.source } : {}),
        ...(session.modelProvider ? { modelProvider: session.modelProvider } : {}),
        ...(session.cliVersion ? { cliVersion: session.cliVersion } : {}),
        ...(session.gitBranch ? { gitBranch: session.gitBranch } : {}),
        archived: session.archived,
        ...(session.openClawSessionKey ? { openClawSessionKey: session.openClawSessionKey } : {}),
        canContinue,
        canArchive,
        canOpenTerminal,
      };
    }),
    ...(host.nextCursor ? { nextCursor: host.nextCursor } : {}),
    ...(host.error ? { error: host.error } : {}),
  };
}
function registerCodexSessionCatalog(params) {
  const provider = {
    id: "codex",
    label: "Codex",
    list: async (query) => {
      const localTerminalAvailable = resolveLocalCodexTerminalExecutable() !== void 0;
      return (
        await listCodexSessionCatalog({
          bindingStore: params.bindingStore,
          config: params.getRuntimeConfig(),
          runtime: params.api.runtime,
          control: params.control,
          query,
        })
      ).hosts.map((host) => toGenericCatalogHost(host, localTerminalAvailable));
    },
    read: async (request) => {
      const page = await readCodexSessionTranscript({
        runtime: params.api.runtime,
        control: params.control,
        hostId: request.hostId,
        threadId: request.threadId,
        cursor: request.cursor,
        limit: request.limit ?? 20,
      });
      return {
        ...page,
        items: page.items.map(toGenericTranscriptItem),
      };
    },
    continueSession: async (request) => {
      const config = params.getRuntimeConfig();
      if (!config) throw new Error("OpenClaw runtime config is unavailable");
      if (request.hostId.startsWith("node:"))
        return await continueNodeCodexSession({
          api: params.api,
          config,
          hostId: request.hostId,
          threadId: request.threadId,
          clientScopes: request.clientScopes,
        });
      if (request.hostId !== "gateway:local")
        throw new CatalogParamsError("Codex session catalog hostId is invalid");
      let upstreamBaseline;
      return codexUpstreamContinueResult(
        (
          await continueLocalCodexSession({
            api: params.api,
            bindingStore: params.bindingStore,
            config,
            control: params.control,
            threadId: request.threadId,
            onContinued: (baseline) => {
              upstreamBaseline = baseline;
            },
          })
        ).sessionKey,
        request.threadId,
        upstreamBaseline,
      );
    },
    checkUpstreamActivity: createChecker(params),
    archive: async (request) => {
      if (request.confirmNoOtherRunner !== true)
        throw new CatalogParamsError(
          "archive requires confirmation that no other runner is active",
        );
      if (request.hostId !== "gateway:local")
        throw new CatalogParamsError("paired-node Codex sessions are view-only");
      const config = params.getRuntimeConfig();
      if (!config) throw new Error("OpenClaw runtime config is unavailable");
      await archiveLocalCodexSession({
        bindingStore: params.bindingStore,
        config,
        control: params.control,
        runtime: params.api.runtime,
        threadId: request.threadId,
      });
      return { ok: true };
    },
    openTerminal: (request) =>
      openCodexCatalogTerminal({
        api: params.api,
        control: params.control,
        parseCatalogPage,
        ...request,
      }),
  };
  params.api.registerSessionCatalog(provider);
}
const codexSessionCatalogRuntime = {
  register: registerCodexSessionCatalog,
  list: listCodexSessionCatalog,
  readTranscript: readCodexSessionTranscript,
  continueLocal: continueLocalCodexSession,
  continueNode: continueNodeCodexSession,
  archiveLocal: archiveLocalCodexSession,
};
//#endregion
export {
  CODEX_LOCAL_SESSION_HOST_ID as a,
  createCodexSessionCatalogNodeInvokePolicies as i,
  createCodexSessionCatalogControl as n,
  assertCodexArchiveDescendantsUnowned as o,
  createCodexSessionCatalogNodeHostCommands as r,
  codexSessionCatalogRuntime as t,
};
