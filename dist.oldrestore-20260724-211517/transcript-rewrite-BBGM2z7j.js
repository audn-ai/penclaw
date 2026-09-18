import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import "./fs-safe-RNq3oO57.js";
import path from "node:path";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as log } from "./logger-C5RMMskO.js";
import { t as privateFileStore } from "./private-file-store-BSksaLX_.js";
import "./store-CzZJhTF6.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as appendRegularFile } from "./regular-file-CuvhUtZS.js";
import "./sessions-Duh5damM.js";
import {
  C as loadTranscriptEvents,
  U as replaceTranscriptEvents,
  Z as resolveSessionTranscriptRuntimeReadTarget,
} from "./session-accessor-PZVNxFCV.js";
import {
  l as parseSessionEntries,
  n as buildSessionContext,
  s as migrateSessionEntries,
} from "./session-manager-BD4l9VJc.js";
import {
  s as resolveSessionWriteLockOptions,
  t as acquireSessionWriteLock,
} from "./session-write-lock-ByENUoH7.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BodrDS39.js";
import { r as isSessionTranscriptSideAppendEntry } from "./transcript-tree-DuZTyiYZ.js";
//#region src/agents/session-raw-append-message.ts
const RAW_APPEND_MESSAGE = Symbol("openclaw.session.rawAppendMessage");
/** Return the unguarded appendMessage implementation for a session manager. */
function getRawSessionAppendMessage(sessionManager) {
  return sessionManager[RAW_APPEND_MESSAGE] ?? sessionManager.appendMessage.bind(sessionManager);
}
/** Stores the unguarded appendMessage implementation on a session manager. */
function setRawSessionAppendMessage(sessionManager, appendMessage) {
  sessionManager[RAW_APPEND_MESSAGE] = appendMessage;
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-file-state.ts
/**
 * Reads, mutates, and atomically writes embedded session transcript files.
 */
const sessionEntryTypes = /* @__PURE__ */ new Set([
  "branch_summary",
  "compaction",
  "custom",
  "custom_message",
  "label",
  "message",
  "model_change",
  "session_info",
  "thinking_level_change",
]);
const repairableToolCallContentTypes = /* @__PURE__ */ new Set([
  "functionCall",
  "function_call",
  "toolCall",
  "toolUse",
  "tool_call",
  "tool_use",
]);
const invalidJsonlSlotType = "__openclaw_invalid_jsonl_slot";
function isString(value) {
  return typeof value === "string" && value.trim() !== "";
}
function isOptionalString(value) {
  return value === void 0 || typeof value === "string";
}
function isTextContent(value) {
  return (
    isRecord(value) &&
    value.type === "text" &&
    typeof value.text === "string" &&
    isOptionalString(value.textSignature)
  );
}
function isThinkingContent(value) {
  return (
    isRecord(value) &&
    value.type === "thinking" &&
    typeof value.thinking === "string" &&
    isOptionalString(value.thinkingSignature) &&
    (value.redacted === void 0 || typeof value.redacted === "boolean")
  );
}
function isImageContent(value) {
  return (
    isRecord(value) &&
    value.type === "image" &&
    typeof value.data === "string" &&
    typeof value.mimeType === "string"
  );
}
function hasToolCallId(value) {
  return (
    isString(value.id) ||
    isString(value.call_id) ||
    isString(value.toolCallId) ||
    isString(value.toolUseId) ||
    isString(value.tool_call_id) ||
    isString(value.tool_use_id)
  );
}
function isToolCallPayload(value) {
  return value === null || isRecord(value) || typeof value === "string";
}
function isToolCallContent(value) {
  return (
    isRecord(value) &&
    typeof value.type === "string" &&
    repairableToolCallContentTypes.has(value.type) &&
    hasToolCallId(value) &&
    isString(value.name) &&
    (value.arguments === void 0 || isToolCallPayload(value.arguments)) &&
    (value.input === void 0 || isToolCallPayload(value.input)) &&
    isOptionalString(value.thoughtSignature)
  );
}
function isPersistedContentBlock(value) {
  if (!isRecord(value) || !isString(value.type)) return false;
  switch (value.type) {
    case "text":
      return isTextContent(value);
    case "thinking":
      return isThinkingContent(value);
    case "image":
      return isImageContent(value);
    default:
      if (repairableToolCallContentTypes.has(value.type)) return isToolCallContent(value);
      return true;
  }
}
function isUserContent(value) {
  return (
    typeof value === "string" ||
    (Array.isArray(value) && value.every((item) => isPersistedContentBlock(item)))
  );
}
function isAssistantContent(value) {
  return (
    typeof value === "string" ||
    (Array.isArray(value) && value.every((item) => isPersistedContentBlock(item)))
  );
}
function isToolResultContent(value) {
  return Array.isArray(value) && value.every((item) => isPersistedContentBlock(item));
}
function isOptionalBoolean(value) {
  return value === void 0 || typeof value === "boolean";
}
function isBashExecutionMessage(value) {
  return (
    isString(value.command) &&
    typeof value.output === "string" &&
    (value.exitCode === void 0 || typeof value.exitCode === "number") &&
    typeof value.cancelled === "boolean" &&
    typeof value.truncated === "boolean" &&
    isOptionalString(value.fullOutputPath) &&
    isOptionalBoolean(value.excludeFromContext)
  );
}
function isAgentMessage(value) {
  if (!isRecord(value)) return false;
  switch (value.role) {
    case "assistant":
      return isAssistantContent(value.content);
    case "bashExecution":
      return isBashExecutionMessage(value);
    case "custom":
      return isString(value.customType) && isUserContent(value.content);
    case "toolResult":
      return (
        isString(value.toolCallId) &&
        isString(value.toolName) &&
        typeof value.isError === "boolean" &&
        isToolResultContent(value.content)
      );
    case "user":
      return isUserContent(value.content);
    default:
      return false;
  }
}
function hasSessionEntryBase(entry) {
  const candidate = entry;
  return (
    isString(candidate.id) &&
    (candidate.parentId === void 0 ||
      candidate.parentId === null ||
      isString(candidate.parentId)) &&
    (candidate.timestamp === void 0 || isString(candidate.timestamp))
  );
}
function isSessionEntry(entry) {
  if (entry.type === "session" || !sessionEntryTypes.has(entry.type) || !hasSessionEntryBase(entry))
    return false;
  switch (entry.type) {
    case "branch_summary": {
      const candidate = entry;
      return isString(candidate.fromId) && typeof candidate.summary === "string";
    }
    case "compaction": {
      const candidate = entry;
      return (
        isString(candidate.firstKeptEntryId) &&
        typeof candidate.summary === "string" &&
        typeof candidate.tokensBefore === "number"
      );
    }
    case "custom":
      return isString(entry.customType);
    case "custom_message": {
      const candidate = entry;
      return (
        isString(candidate.customType) &&
        isUserContent(candidate.content) &&
        typeof candidate.display === "boolean"
      );
    }
    case "label": {
      const candidate = entry;
      return (
        isString(candidate.targetId) &&
        (candidate.label === void 0 || typeof candidate.label === "string")
      );
    }
    case "message":
      return isAgentMessage(entry.message);
    case "model_change": {
      const candidate = entry;
      return isString(candidate.provider) && isString(candidate.modelId);
    }
    case "session_info": {
      const candidate = entry;
      return candidate.name === void 0 || typeof candidate.name === "string";
    }
    case "thinking_level_change":
      return isString(entry.thinkingLevel);
  }
  return false;
}
function parseLeafControlEntry(entry) {
  if (!isRecord(entry) || entry.type !== "leaf") return;
  const candidate = entry;
  if (
    !isString(candidate.id) ||
    (candidate.parentId !== void 0 &&
      candidate.parentId !== null &&
      !isString(candidate.parentId)) ||
    (candidate.timestamp !== void 0 && !isString(candidate.timestamp)) ||
    (candidate.targetId !== null && typeof candidate.targetId !== "string") ||
    (candidate.appendParentId !== void 0 &&
      candidate.appendParentId !== null &&
      typeof candidate.appendParentId !== "string") ||
    (candidate.appendMode !== void 0 && candidate.appendMode !== "side")
  )
    return;
  return {
    id: candidate.id,
    parentId: candidate.parentId ?? null,
    targetId: candidate.targetId,
    ...(candidate.appendParentId !== void 0 ? { appendParentId: candidate.appendParentId } : {}),
    ...(candidate.appendMode === "side" ? { appendMode: candidate.appendMode } : {}),
  };
}
function readableSessionState(fileEntries) {
  const entries = [];
  const acceptedIds = /* @__PURE__ */ new Set();
  const acceptedEntryById = /* @__PURE__ */ new Map();
  const rejectedIds = /* @__PURE__ */ new Set();
  const rejectedParentById = /* @__PURE__ */ new Map();
  const logicalParentsById = /* @__PURE__ */ new Map();
  const invalidLeafIds = /* @__PURE__ */ new Set();
  const firstReadableDescendantByRejectedId = /* @__PURE__ */ new Map();
  const rejectedAncestorsByAcceptedId = /* @__PURE__ */ new Map();
  let effectiveLeafId = null;
  let effectiveAppendParentId = null;
  let effectiveAppendMode;
  const acceptedPath = (leafId) => {
    const pathLocal = [];
    let id = leafId ?? null;
    const seen = /* @__PURE__ */ new Set();
    while (id !== null) {
      if (seen.has(id)) break;
      seen.add(id);
      const entry = acceptedEntryById.get(id);
      if (!entry) break;
      pathLocal.unshift(entry);
      id = entry.parentId;
    }
    return pathLocal;
  };
  const firstReadableDescendantOnBranch = (rejectedId, leafId) => {
    for (const entry of acceptedPath(leafId))
      if (rejectedAncestorsByAcceptedId.get(entry.id)?.includes(rejectedId)) return entry.id;
  };
  const rejectedParentChain = (parentId) => {
    const chain = [];
    let resolved = parentId ?? null;
    const seen = /* @__PURE__ */ new Set();
    while (resolved !== null && rejectedParentById.has(resolved)) {
      if (seen.has(resolved)) break;
      seen.add(resolved);
      chain.push(resolved);
      resolved = rejectedParentById.get(resolved) ?? null;
    }
    return chain;
  };
  const resolveRejectedParent = (parentId) => {
    let resolved = parentId ?? null;
    const seen = /* @__PURE__ */ new Set();
    while (resolved !== null && rejectedParentById.has(resolved)) {
      if (seen.has(resolved)) return null;
      seen.add(resolved);
      resolved = rejectedParentById.get(resolved) ?? null;
    }
    return resolved;
  };
  const repairEntryLinks = (entry) => {
    const rejectedAncestors = rejectedParentChain(entry.parentId);
    const resolvedRejectedParent =
      rejectedAncestors.length > 0 ? resolveRejectedParent(entry.parentId) : void 0;
    const parentId =
      resolvedRejectedParent !== void 0
        ? resolvedRejectedParent !== null && acceptedIds.has(resolvedRejectedParent)
          ? resolvedRejectedParent
          : null
        : (entry.parentId ?? null);
    let repaired =
      parentId === entry.parentId
        ? entry
        : {
            ...entry,
            parentId,
          };
    if (repaired.type === "compaction" && rejectedIds.has(repaired.firstKeptEntryId)) {
      const resolvedFirstKeptParent = resolveRejectedParent(repaired.firstKeptEntryId);
      const firstKeptEntryId =
        (resolvedFirstKeptParent !== null && acceptedIds.has(resolvedFirstKeptParent)
          ? resolvedFirstKeptParent
          : void 0) ??
        firstReadableDescendantOnBranch(repaired.firstKeptEntryId, parentId) ??
        firstReadableDescendantByRejectedId.get(repaired.firstKeptEntryId) ??
        parentId;
      if (firstKeptEntryId !== null && firstKeptEntryId !== repaired.firstKeptEntryId)
        repaired = {
          ...repaired,
          firstKeptEntryId,
        };
    }
    if (repaired.type !== "compaction") {
      for (const rejectedId of rejectedAncestors)
        if (!firstReadableDescendantByRejectedId.has(rejectedId))
          firstReadableDescendantByRejectedId.set(rejectedId, repaired.id);
      if (rejectedAncestors.length > 0)
        rejectedAncestorsByAcceptedId.set(repaired.id, rejectedAncestors);
    }
    return repaired;
  };
  for (const rawEntry of fileEntries) {
    if (!isRecord(rawEntry)) continue;
    const rawRecord = rawEntry;
    const entry = rawEntry;
    const id = rawRecord.id;
    const rawType = rawRecord.type;
    const rawParentId = rawRecord.parentId;
    const leafEntry = parseLeafControlEntry(rawRecord);
    if (leafEntry) {
      rejectedIds.add(leafEntry.id);
      const targetIsKnown =
        leafEntry.targetId === null ||
        acceptedIds.has(leafEntry.targetId) ||
        (rejectedParentById.has(leafEntry.targetId) && !invalidLeafIds.has(leafEntry.targetId));
      const appendParentIsKnown =
        leafEntry.appendParentId === void 0 ||
        leafEntry.appendParentId === null ||
        acceptedIds.has(leafEntry.appendParentId) ||
        (rejectedParentById.has(leafEntry.appendParentId) &&
          !invalidLeafIds.has(leafEntry.appendParentId));
      if (!targetIsKnown || !appendParentIsKnown) {
        invalidLeafIds.add(leafEntry.id);
        rejectedParentById.set(leafEntry.id, leafEntry.parentId);
        continue;
      }
      rejectedParentById.set(leafEntry.id, leafEntry.targetId);
      const resolvedTargetId = resolveRejectedParent(leafEntry.targetId);
      effectiveLeafId =
        resolvedTargetId !== null && acceptedIds.has(resolvedTargetId) ? resolvedTargetId : null;
      effectiveAppendParentId =
        leafEntry.appendParentId === void 0 ? effectiveLeafId : leafEntry.appendParentId;
      effectiveAppendMode = leafEntry.appendMode;
      continue;
    }
    if (rawType === "leaf") {
      if (isString(id)) {
        rejectedIds.add(id);
        invalidLeafIds.add(id);
        rejectedParentById.set(id, isString(rawParentId) ? rawParentId : null);
      }
      continue;
    }
    if (!isSessionEntry(entry)) {
      if (isString(id)) {
        rejectedIds.add(id);
        rejectedParentById.set(id, isString(rawParentId) ? rawParentId : null);
        if (
          typeof rawType === "string" &&
          rawType !== "session" &&
          !id.startsWith("__openclaw_invalid_jsonl_slot_") &&
          !sessionEntryTypes.has(rawType) &&
          Object.hasOwn(rawRecord, "parentId") &&
          (rawParentId === null || isString(rawParentId))
        )
          effectiveAppendParentId = id;
      }
      continue;
    }
    if (entry.type === "label" && !acceptedIds.has(entry.targetId)) {
      rejectedIds.add(entry.id);
      rejectedParentById.set(entry.id, entry.parentId);
      continue;
    }
    if (acceptedIds.has(entry.id)) continue;
    if (
      !Object.hasOwn(rawRecord, "parentId") ||
      (!isSessionTranscriptSideAppendEntry(rawRecord) &&
        entry.parentId === effectiveAppendParentId &&
        effectiveLeafId !== effectiveAppendParentId)
    )
      logicalParentsById.set(entry.id, effectiveLeafId);
    const repaired = repairEntryLinks(entry);
    entries.push(repaired);
    acceptedIds.add(repaired.id);
    acceptedEntryById.set(repaired.id, repaired);
    effectiveAppendParentId = repaired.id;
    if (isSessionTranscriptSideAppendEntry(rawRecord)) effectiveAppendMode = "side";
    else {
      effectiveLeafId = repaired.id;
      effectiveAppendMode = void 0;
    }
  }
  return {
    entries,
    leafId: effectiveLeafId,
    appendParentId: effectiveAppendParentId,
    ...(effectiveAppendMode ? { appendMode: effectiveAppendMode } : {}),
    opaqueParentsById: rejectedParentById,
    logicalParentsById,
  };
}
function sessionHeaderVersion(header) {
  return typeof header?.version === "number" ? header.version : 1;
}
function generateEntryId(byId) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const id = randomUUID().slice(0, 8);
    if (!byId.has(id)) return id;
  }
  return randomUUID();
}
function serializeTranscriptFileEntries(entries) {
  return `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
}
function fileEntryOrMigrationSlot(value, index) {
  if (isRecord(value)) return value;
  return {
    type: invalidJsonlSlotType,
    id: `__openclaw_invalid_jsonl_slot_${index}`,
    parentId: null,
    timestamp: "1970-01-01T00:00:00.000Z",
  };
}
function createReadableTranscriptFileState(params) {
  const readable = readableSessionState(params.fileEntries);
  return new TranscriptFileState({
    header: params.header,
    entries: readable.entries,
    leafId: readable.leafId,
    appendParentId: params.migrated ? readable.leafId : readable.appendParentId,
    ...(!params.migrated && readable.appendMode ? { appendMode: readable.appendMode } : {}),
    opaqueParentsById: readable.opaqueParentsById,
    logicalParentsById: readable.logicalParentsById,
    migrated: params.migrated,
  });
}
/** Builds readable branch state from persisted transcript records. */
function createTranscriptFileStateFromPersistedEntries(entries) {
  const fileEntries = entries.map(fileEntryOrMigrationSlot);
  return createReadableTranscriptFileState({
    fileEntries,
    header: fileEntries.find((entry) => entry.type === "session") ?? null,
  });
}
/** In-memory transcript state with branch, label, and append helpers. */
var TranscriptFileState = class {
  constructor(params) {
    this.byId = /* @__PURE__ */ new Map();
    this.labelsById = /* @__PURE__ */ new Map();
    this.labelTimestampsById = /* @__PURE__ */ new Map();
    this.opaqueParentsById = /* @__PURE__ */ new Map();
    this.logicalParentsById = /* @__PURE__ */ new Map();
    this.leafId = null;
    this.appendParentId = null;
    this.header = params.header;
    this.entries = [...params.entries];
    this.migrated = params.migrated === true;
    for (const [id, parentId] of params.opaqueParentsById ?? [])
      this.opaqueParentsById.set(id, parentId);
    for (const [id, parentId] of params.logicalParentsById ?? [])
      this.logicalParentsById.set(id, parentId);
    this.rebuildIndex(params.leafId, params.appendParentId);
    this.appendMode = params.appendMode;
  }
  resolveCanonicalParentId(parentId) {
    const seen = /* @__PURE__ */ new Set();
    let currentId = parentId;
    while (currentId !== null && this.opaqueParentsById.has(currentId)) {
      if (seen.has(currentId)) return null;
      seen.add(currentId);
      currentId = this.opaqueParentsById.get(currentId) ?? null;
    }
    return currentId;
  }
  rebuildIndex(leafId, appendParentId) {
    this.byId.clear();
    this.labelsById.clear();
    this.labelTimestampsById.clear();
    this.leafId = null;
    this.appendParentId = null;
    for (const entry of this.entries) {
      this.byId.set(entry.id, entry);
      this.leafId = entry.id;
      this.appendParentId = entry.id;
      if (entry.type === "label")
        if (entry.label) {
          this.labelsById.set(entry.targetId, entry.label);
          this.labelTimestampsById.set(entry.targetId, entry.timestamp);
        } else {
          this.labelsById.delete(entry.targetId);
          this.labelTimestampsById.delete(entry.targetId);
        }
    }
    if (leafId !== void 0) this.leafId = leafId;
    if (appendParentId !== void 0) this.appendParentId = appendParentId;
    else if (leafId !== void 0) this.appendParentId = leafId;
  }
  getCwd() {
    return this.header?.cwd ?? process.cwd();
  }
  getHeader() {
    return this.header;
  }
  getEntries() {
    return [...this.entries];
  }
  getLeafId() {
    return this.leafId;
  }
  getAppendParentId() {
    return this.appendParentId;
  }
  getAppendMode() {
    return this.appendMode;
  }
  getLeafEntry() {
    return this.leafId ? this.byId.get(this.leafId) : void 0;
  }
  getLabel(id) {
    return this.labelsById.get(id);
  }
  getBranch(fromId) {
    const branch = [];
    const seen = /* @__PURE__ */ new Set();
    let currentId = fromId ?? this.leafId;
    while (currentId && !seen.has(currentId)) {
      const current = this.byId.get(currentId);
      if (!current) break;
      seen.add(current.id);
      const resolvedParentId = this.logicalParentsById.has(current.id)
        ? (this.logicalParentsById.get(current.id) ?? null)
        : this.resolveCanonicalParentId(current.parentId);
      const parentId =
        resolvedParentId === current.id || (resolvedParentId && seen.has(resolvedParentId))
          ? null
          : resolvedParentId;
      branch.push(
        parentId === current.parentId
          ? current
          : {
              ...current,
              parentId,
            },
      );
      currentId = parentId;
    }
    branch.reverse();
    return branch;
  }
  buildSessionContext() {
    const entries = this.getBranch();
    return buildSessionContext(
      entries,
      entries.at(-1)?.id ?? null,
      new Map(entries.map((entry) => [entry.id, entry])),
    );
  }
  /** Move the active leaf to an existing entry without appending a row. */
  branch(branchFromId) {
    if (!this.byId.has(branchFromId)) throw new Error(`Entry ${branchFromId} not found`);
    this.leafId = branchFromId;
    this.appendParentId = branchFromId;
    this.appendMode = void 0;
  }
  /** Clear the active leaf so the next append starts a root branch. */
  resetLeaf() {
    this.leafId = null;
    this.appendParentId = null;
    this.appendMode = void 0;
  }
  appendMessage(message) {
    return this.appendEntry({
      type: "message",
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      message,
    });
  }
  appendThinkingLevelChange(thinkingLevel) {
    return this.appendEntry({
      type: "thinking_level_change",
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      thinkingLevel,
    });
  }
  appendModelChange(provider, modelId) {
    return this.appendEntry({
      type: "model_change",
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      provider,
      modelId,
    });
  }
  appendCompaction(summary, firstKeptEntryId, tokensBefore, details, fromHook) {
    return this.appendEntry({
      type: "compaction",
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      summary,
      firstKeptEntryId,
      tokensBefore,
      details,
      fromHook,
    });
  }
  appendCustomEntry(customType, data) {
    return this.appendEntry({
      type: "custom",
      customType,
      data,
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    });
  }
  appendSessionInfo(name) {
    return this.appendEntry({
      type: "session_info",
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      name: name.trim(),
    });
  }
  appendCustomMessageEntry(customType, content, display, details) {
    return this.appendEntry({
      type: "custom_message",
      customType,
      content,
      display,
      details,
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    });
  }
  appendLabelChange(targetId, label) {
    if (!this.byId.has(targetId)) throw new Error(`Entry ${targetId} not found`);
    return this.appendEntry({
      type: "label",
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      targetId,
      label,
    });
  }
  branchWithSummary(branchFromId, summary, details, fromHook) {
    if (branchFromId !== null && !this.byId.has(branchFromId))
      throw new Error(`Entry ${branchFromId} not found`);
    this.leafId = branchFromId;
    this.appendParentId = branchFromId;
    return this.appendEntry({
      type: "branch_summary",
      id: generateEntryId(this.byId),
      parentId: branchFromId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      fromId: branchFromId ?? "root",
      summary,
      details,
      fromHook,
    });
  }
  appendLeafControl(params) {
    if (params.targetId !== null && !this.byId.has(params.targetId))
      throw new Error(`Entry ${params.targetId} not found`);
    if (
      params.appendParentId !== null &&
      !this.byId.has(params.appendParentId) &&
      !this.opaqueParentsById.has(params.appendParentId)
    )
      throw new Error(`Entry ${params.appendParentId} not found`);
    const entry = {
      type: "leaf",
      id: generateEntryId({ has: (id) => this.byId.has(id) || this.opaqueParentsById.has(id) }),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      targetId: params.targetId,
      ...(params.appendParentId !== params.targetId
        ? { appendParentId: params.appendParentId }
        : {}),
      ...(params.appendMode ? { appendMode: params.appendMode } : {}),
    };
    this.opaqueParentsById.set(entry.id, params.targetId);
    this.leafId = params.targetId;
    this.appendParentId = params.appendParentId;
    this.appendMode = params.appendMode;
    return entry;
  }
  appendEntry(entry) {
    if (
      !isSessionTranscriptSideAppendEntry(entry) &&
      entry.parentId === this.appendParentId &&
      this.leafId !== this.appendParentId
    )
      this.logicalParentsById.set(entry.id, this.leafId);
    this.entries.push(entry);
    this.byId.set(entry.id, entry);
    this.appendParentId = entry.id;
    if (isSessionTranscriptSideAppendEntry(entry)) this.appendMode = "side";
    else {
      this.leafId = entry.id;
      this.appendMode = void 0;
    }
    if (entry.type === "label")
      if (entry.label) {
        this.labelsById.set(entry.targetId, entry.label);
        this.labelTimestampsById.set(entry.targetId, entry.timestamp);
      } else {
        this.labelsById.delete(entry.targetId);
        this.labelTimestampsById.delete(entry.targetId);
      }
    return entry;
  }
};
/** Read a transcript file, migrate old rows, and drop only unrecoverable entries. */
async function readTranscriptFileState(sessionFile) {
  const fileEntries = parseSessionEntries(await fs.readFile(sessionFile, "utf-8")).map(
    fileEntryOrMigrationSlot,
  );
  const migrated =
    sessionHeaderVersion(fileEntries.find((entry) => entry.type === "session") ?? null) < 3;
  migrateSessionEntries(fileEntries);
  return createReadableTranscriptFileState({
    fileEntries,
    header: fileEntries.find((entry) => entry.type === "session") ?? null,
    migrated,
  });
}
/** Rewrite the full transcript through the private-file store. */
async function writeTranscriptFileAtomic(filePath, entries) {
  await privateFileStore(path.dirname(filePath)).writeText(
    path.basename(filePath),
    serializeTranscriptFileEntries(entries),
  );
}
/** Persist a state mutation using append-only writes unless migration forced a rewrite. */
async function persistTranscriptStateMutation(params) {
  if (params.appendedEntries.length === 0 && !params.state.migrated) return;
  if (params.state.migrated) {
    const appendedLeafControls = params.appendedEntries.filter((entry) => entry.type === "leaf");
    await writeTranscriptFileAtomic(params.sessionFile, [
      ...(params.state.header ? [params.state.header] : []),
      ...params.state.entries,
      ...appendedLeafControls,
    ]);
    return;
  }
  await appendRegularFile({
    filePath: params.sessionFile,
    content: `${params.appendedEntries.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
    rejectSymlinkParents: true,
  });
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-runtime-state.ts
/**
 * Resolves the runtime transcript target for read/probe operations without
 * linking missing file-backed metadata into the session store.
 */
async function resolveRuntimeTranscriptReadTarget(scope) {
  return await resolveSessionTranscriptRuntimeReadTarget(scope);
}
/**
 * Persists an append or migration rewrite for a resolved runtime transcript.
 */
async function persistRuntimeTranscriptStateMutation(params) {
  await persistTranscriptStateMutation({
    sessionFile: params.target.sessionFile,
    state: params.state,
    appendedEntries: params.appendedEntries,
  });
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-rewrite.ts
function isTranscriptEventRecord(event) {
  return typeof event === "object" && event !== null && !Array.isArray(event);
}
async function rewriteSqliteRuntimeTranscript(params) {
  const marker = parseSqliteSessionFileMarker(params.target.sessionFile);
  if (!marker)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "not a SQLite transcript target",
    };
  const replacementsById = new Map(
    params.request.replacements.map((replacement) => [replacement.entryId, replacement.message]),
  );
  let bytesFreed = 0;
  let rewrittenEntries = 0;
  const nextEvents = (
    await loadTranscriptEvents({
      agentId: marker.agentId,
      sessionId: marker.sessionId,
      sessionKey: params.target.sessionKey,
      storePath: marker.storePath,
    })
  ).map((event) => {
    if (!isTranscriptEventRecord(event)) return event;
    const eventId = typeof event.id === "string" ? event.id : void 0;
    const replacement = eventId ? replacementsById.get(eventId) : void 0;
    if (!replacement || event.type !== "message") return event;
    bytesFreed += Math.max(
      0,
      Buffer.byteLength(JSON.stringify(event.message), "utf8") -
        Buffer.byteLength(JSON.stringify(replacement), "utf8"),
    );
    rewrittenEntries += 1;
    return Object.assign({}, event, { message: replacement });
  });
  if (rewrittenEntries === 0)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "no matching transcript entries",
    };
  await replaceTranscriptEvents(
    {
      agentId: marker.agentId,
      sessionId: marker.sessionId,
      sessionKey: params.target.sessionKey,
      storePath: marker.storePath,
    },
    nextEvents,
  );
  emitSessionTranscriptUpdate({
    sessionFile: params.target.sessionFile,
    sessionKey: params.target.sessionKey,
    agentId: params.target.agentId,
    target: {
      agentId: params.target.agentId,
      sessionId: params.target.sessionId,
      sessionKey: params.target.sessionKey,
    },
  });
  return {
    changed: true,
    bytesFreed,
    rewrittenEntries,
  };
}
function estimateMessageBytes(message) {
  return Buffer.byteLength(JSON.stringify(message), "utf8");
}
function findTranscriptRewriteMatches(branch, replacementsById) {
  const matchedIndices = [];
  let bytesFreed = 0;
  for (const [index, entry] of branch.entries()) {
    if (entry.type !== "message") continue;
    const replacement = replacementsById.get(entry.id);
    if (!replacement) continue;
    const originalBytes = estimateMessageBytes(entry.message);
    const replacementBytes = estimateMessageBytes(replacement);
    matchedIndices.push(index);
    bytesFreed += Math.max(0, originalBytes - replacementBytes);
  }
  return {
    matchedIndices,
    bytesFreed,
  };
}
function remapEntryId(entryId, rewrittenEntryIds) {
  if (!entryId) return null;
  return rewrittenEntryIds.get(entryId) ?? entryId;
}
function appendBranchEntry(params) {
  const { sessionManager, entry, rewrittenEntryIds, appendMessage } = params;
  if (entry.type === "message") return appendMessage(entry.message);
  if (entry.type === "compaction")
    return sessionManager.appendCompaction(
      entry.summary,
      remapEntryId(entry.firstKeptEntryId, rewrittenEntryIds) ?? entry.firstKeptEntryId,
      entry.tokensBefore,
      entry.details,
      entry.fromHook,
    );
  if (entry.type === "thinking_level_change")
    return sessionManager.appendThinkingLevelChange(entry.thinkingLevel);
  if (entry.type === "model_change")
    return sessionManager.appendModelChange(entry.provider, entry.modelId);
  if (entry.type === "custom")
    return sessionManager.appendCustomEntry(entry.customType, entry.data);
  if (entry.type === "custom_message")
    return sessionManager.appendCustomMessageEntry(
      entry.customType,
      entry.content,
      entry.display,
      entry.details,
    );
  if (entry.type === "session_info") {
    if (entry.name) return sessionManager.appendSessionInfo(entry.name);
    return sessionManager.appendSessionInfo("");
  }
  if (entry.type === "branch_summary")
    return sessionManager.branchWithSummary(
      remapEntryId(entry.parentId, rewrittenEntryIds),
      entry.summary,
      entry.details,
      entry.fromHook,
    );
  return sessionManager.appendLabelChange(
    remapEntryId(entry.targetId, rewrittenEntryIds) ?? entry.targetId,
    entry.label,
  );
}
function appendTranscriptStateBranchEntry(params) {
  const { state, entry, rewrittenEntryIds } = params;
  if (entry.type === "message") return state.appendMessage(entry.message);
  if (entry.type === "compaction")
    return state.appendCompaction(
      entry.summary,
      remapEntryId(entry.firstKeptEntryId, rewrittenEntryIds) ?? entry.firstKeptEntryId,
      entry.tokensBefore,
      entry.details,
      entry.fromHook,
    );
  if (entry.type === "thinking_level_change")
    return state.appendThinkingLevelChange(entry.thinkingLevel);
  if (entry.type === "model_change") return state.appendModelChange(entry.provider, entry.modelId);
  if (entry.type === "custom") return state.appendCustomEntry(entry.customType, entry.data);
  if (entry.type === "custom_message")
    return state.appendCustomMessageEntry(
      entry.customType,
      entry.content,
      entry.display,
      entry.details,
    );
  if (entry.type === "session_info") return state.appendSessionInfo(entry.name ?? "");
  if (entry.type === "branch_summary")
    return state.branchWithSummary(
      remapEntryId(entry.parentId, rewrittenEntryIds),
      entry.summary,
      entry.details,
      entry.fromHook,
    );
  return state.appendLabelChange(
    remapEntryId(entry.targetId, rewrittenEntryIds) ?? entry.targetId,
    entry.label,
  );
}
/**
 * Safely rewrites transcript message entries on the active branch by branching
 * from the first rewritten message's parent and re-appending the suffix.
 */
function rewriteTranscriptEntriesInSessionManager(params) {
  const replacementsById = new Map(
    params.replacements
      .filter((replacement) => replacement.entryId.trim().length > 0)
      .map((replacement) => [replacement.entryId, replacement.message]),
  );
  if (replacementsById.size === 0)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "no replacements requested",
    };
  const branch = params.sessionManager.getBranch();
  if (branch.length === 0)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "empty session",
    };
  const { matchedIndices, bytesFreed } = findTranscriptRewriteMatches(branch, replacementsById);
  if (matchedIndices.length === 0)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "no matching message entries",
    };
  const firstMatchedIndex = matchedIndices.at(0);
  const firstMatchedEntry = firstMatchedIndex === void 0 ? void 0 : branch.at(firstMatchedIndex);
  if (!firstMatchedEntry || firstMatchedEntry.type !== "message")
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "invalid first rewrite target",
    };
  if (!firstMatchedEntry.parentId) params.sessionManager.resetLeaf();
  else params.sessionManager.branch(firstMatchedEntry.parentId);
  const appendMessage = getRawSessionAppendMessage(params.sessionManager);
  const rewrittenEntryIds = /* @__PURE__ */ new Map();
  for (const entry of branch.slice(firstMatchedIndex)) {
    const replacement = entry.type === "message" ? replacementsById.get(entry.id) : void 0;
    const newEntryId =
      replacement === void 0
        ? appendBranchEntry({
            sessionManager: params.sessionManager,
            entry,
            rewrittenEntryIds,
            appendMessage,
          })
        : appendMessage(replacement);
    rewrittenEntryIds.set(entry.id, newEntryId);
  }
  return {
    changed: true,
    bytesFreed,
    rewrittenEntries: matchedIndices.length,
  };
}
function rewriteTranscriptEntriesInState(params) {
  const replacementsById = new Map(
    params.replacements
      .filter((replacement) => replacement.entryId.trim().length > 0)
      .map((replacement) => [replacement.entryId, replacement.message]),
  );
  if (replacementsById.size === 0)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "no replacements requested",
      appendedEntries: [],
    };
  const originalLeafId = params.state.getLeafId();
  const originalAppendParentId = params.state.getAppendParentId();
  const originalAppendMode = params.state.getAppendMode();
  const activeBranch = params.state.getBranch();
  const allEntries = params.state.getEntries();
  let branch = activeBranch;
  let restoreOriginalNavigation = false;
  const replacementIdsOnBranch = (candidate) =>
    new Set(
      candidate
        .filter((entry) => entry.type === "message" && replacementsById.has(entry.id))
        .map((entry) => entry.id),
    );
  const activeReplacementIds = replacementIdsOnBranch(activeBranch);
  if (activeReplacementIds.size > 0 && activeReplacementIds.size < replacementsById.size)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "rewrite targets span multiple branches",
      appendedEntries: [],
    };
  const activeBranchHasEveryReplacement = activeReplacementIds.size === replacementsById.size;
  if (!activeBranchHasEveryReplacement && params.allowedRewriteSuffixEntryIds) {
    const allowedIds = new Set(params.allowedRewriteSuffixEntryIds);
    const sideBranch = allEntries
      .toReversed()
      .filter((entry) => allowedIds.has(entry.id))
      .map((entry) => params.state.getBranch(entry.id))
      .find((candidate) => replacementIdsOnBranch(candidate).size === replacementsById.size);
    if (sideBranch) {
      branch = sideBranch;
      restoreOriginalNavigation = true;
    }
  }
  if (
    !activeBranchHasEveryReplacement &&
    !restoreOriginalNavigation &&
    activeReplacementIds.size === 0 &&
    params.replacements.some((replacement) =>
      allEntries.some((entry) => entry.id === replacement.entryId),
    )
  )
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "rewrite targets span multiple branches",
      appendedEntries: [],
    };
  if (branch.length === 0)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "empty session",
      appendedEntries: [],
    };
  const { matchedIndices, bytesFreed } = findTranscriptRewriteMatches(branch, replacementsById);
  if (matchedIndices.length === 0)
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "no matching message entries",
      appendedEntries: [],
    };
  const firstMatchedIndex = matchedIndices.at(0);
  const firstMatchedEntry = firstMatchedIndex === void 0 ? void 0 : branch.at(firstMatchedIndex);
  if (!firstMatchedEntry || firstMatchedEntry.type !== "message")
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason: "invalid first rewrite target",
      appendedEntries: [],
    };
  if (params.allowedRewriteSuffixEntryIds) {
    const allowedIds = new Set(params.allowedRewriteSuffixEntryIds);
    if (
      branch
        .slice(firstMatchedIndex)
        .some((entry) => typeof entry.id === "string" && !allowedIds.has(entry.id))
    )
      return {
        changed: false,
        bytesFreed: 0,
        rewrittenEntries: 0,
        reason: "rewrite suffix guard failed",
        appendedEntries: [],
      };
  }
  if (!firstMatchedEntry.parentId) params.state.resetLeaf();
  else params.state.branch(firstMatchedEntry.parentId);
  const appendedEntries = [];
  const rewrittenEntryIds = /* @__PURE__ */ new Map();
  for (const entry of branch.slice(firstMatchedIndex)) {
    const replacement = entry.type === "message" ? replacementsById.get(entry.id) : void 0;
    const newEntry =
      replacement === void 0
        ? appendTranscriptStateBranchEntry({
            state: params.state,
            entry,
            rewrittenEntryIds,
          })
        : params.state.appendMessage(replacement);
    rewrittenEntryIds.set(entry.id, newEntry.id);
    appendedEntries.push(newEntry);
  }
  if (restoreOriginalNavigation)
    appendedEntries.push(
      params.state.appendLeafControl({
        targetId: originalLeafId,
        appendParentId: originalAppendParentId,
        ...(originalAppendMode ? { appendMode: originalAppendMode } : {}),
      }),
    );
  return {
    changed: true,
    bytesFreed,
    rewrittenEntries: matchedIndices.length,
    appendedEntries,
  };
}
/**
 * Rewrites message entries for a runtime transcript without using the
 * file-backed path as caller identity.
 */
async function rewriteTranscriptEntriesInRuntimeTranscript(params) {
  let sessionLock;
  try {
    const target = await resolveRuntimeTranscriptReadTarget(params.scope);
    if (parseSqliteSessionFileMarker(target.sessionFile))
      return await rewriteSqliteRuntimeTranscript({
        target,
        request: params.request,
      });
    sessionLock = await acquireSessionWriteLock({
      sessionFile: target.sessionFile,
      ...resolveSessionWriteLockOptions(params.config),
    });
    const state = await readTranscriptFileState(target.sessionFile);
    const result = rewriteTranscriptEntriesInState({
      state,
      replacements: params.request.replacements,
      ...(params.request.allowedRewriteSuffixEntryIds
        ? { allowedRewriteSuffixEntryIds: params.request.allowedRewriteSuffixEntryIds }
        : {}),
    });
    if (result.changed) {
      await persistRuntimeTranscriptStateMutation({
        target,
        state,
        appendedEntries: result.appendedEntries,
      });
      emitSessionTranscriptUpdate({
        sessionFile: target.sessionFile,
        sessionKey: target.sessionKey,
        agentId: target.agentId,
        target: {
          agentId: target.agentId,
          sessionId: target.sessionId,
          sessionKey: target.sessionKey,
        },
      });
      log.info(
        `[transcript-rewrite] rewrote ${result.rewrittenEntries} entr${result.rewrittenEntries === 1 ? "y" : "ies"} bytesFreed=${result.bytesFreed} sessionKey=${target.sessionKey}`,
      );
    }
    return result;
  } catch (err) {
    const reason = formatErrorMessage(err);
    log.warn(`[transcript-rewrite] failed: ${reason}`);
    return {
      changed: false,
      bytesFreed: 0,
      rewrittenEntries: 0,
      reason,
    };
  } finally {
    await sessionLock?.release();
  }
}
//#endregion
export {
  TranscriptFileState as a,
  readTranscriptFileState as c,
  setRawSessionAppendMessage as d,
  resolveRuntimeTranscriptReadTarget as i,
  writeTranscriptFileAtomic as l,
  rewriteTranscriptEntriesInSessionManager as n,
  createTranscriptFileStateFromPersistedEntries as o,
  rewriteTranscriptEntriesInState as r,
  persistTranscriptStateMutation as s,
  rewriteTranscriptEntriesInRuntimeTranscript as t,
  getRawSessionAppendMessage as u,
};
