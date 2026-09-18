import { createHash } from "node:crypto";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  F as publishTranscriptUpdate,
  H as replaceSessionEntrySync,
  S as loadSessionEntry,
  Wt as redactTranscriptMessage,
  lt as withTranscriptWriteTransaction,
} from "./session-accessor-PZVNxFCV.js";
import { t as SessionManager } from "./session-manager-BD4l9VJc.js";
import { t as resolveWorkerSessionTarget } from "./session-target-CAMdjbd6.js";
import { t as stableStringify } from "./stable-stringify-Cd9_EGsU.js";
//#region src/gateway/worker-environments/transcript-commit-store.ts
const REQUEST_HASH_PATTERN = /^[a-f0-9]{64}$/u;
function required(value, field) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`Worker transcript commit ${field} must be a non-empty string`);
  return value.trim();
}
function nonNegativeInteger(value, field) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw new Error(`Worker transcript commit ${field} must be a non-negative integer`);
  return value;
}
function positiveInteger(value, field) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1)
    throw new Error(`Worker transcript commit ${field} must be a positive integer`);
  return value;
}
function normalizeRequestHash(value) {
  if (typeof value !== "string" || !REQUEST_HASH_PATTERN.test(value))
    throw new Error("Worker transcript commit request hash must be lowercase SHA-256 hex");
  return value;
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyStringArray(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((entry) => typeof entry === "string" && entry.length > 0)
  );
}
function isCommitResult(value) {
  if (!isRecord(value) || !isNonEmptyStringArray(value.entryIds)) return false;
  return typeof value.newLeafId === "string" && value.newLeafId.length > 0;
}
function isCommitErrorReason(value) {
  return (
    value === "stale-base-leaf" ||
    value === "epoch-mismatch" ||
    value === "invalid-batch" ||
    value === "session-not-attached"
  );
}
function parseOutcomeJson(value) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw new Error("Worker transcript commit cached outcome is invalid", { cause: error });
  }
  if (!isRecord(parsed)) throw new Error("Worker transcript commit cached outcome is invalid");
  if (parsed.ok === true && isCommitResult(parsed.result))
    return {
      ok: true,
      result: parsed.result,
    };
  if (parsed.ok === false && isCommitErrorReason(parsed.reason))
    return {
      ok: false,
      reason: parsed.reason,
    };
  throw new Error("Worker transcript commit cached outcome is invalid");
}
function serializeOutcome(outcome) {
  const serialized = JSON.stringify(outcome);
  if (!serialized) throw new Error("Worker transcript commit outcome is not serializable");
  return serialized;
}
function normalizeInput(input, nowMs) {
  return {
    environmentId: required(input.environmentId, "environment id"),
    sessionId: required(input.sessionId, "session id"),
    runEpoch: nonNegativeInteger(input.runEpoch, "run epoch"),
    seq: positiveInteger(input.seq, "sequence"),
    requestHash: normalizeRequestHash(input.requestHash),
    nowMs: nonNegativeInteger(nowMs, "timestamp"),
  };
}
const query = (db) => getNodeSqliteKysely(db);
function findHead(db, input) {
  return executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_transcript_commit_heads")
      .selectAll()
      .where("session_id", "=", input.sessionId)
      .where("run_epoch", "=", input.runEpoch),
  );
}
function findCommit(db, input) {
  return executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_transcript_commits")
      .selectAll()
      .where("session_id", "=", input.sessionId)
      .where("run_epoch", "=", input.runEpoch)
      .where("seq", "=", input.seq),
  );
}
function classifyExistingCommit(params) {
  if (!params.commit) return;
  if (!params.head) throw new Error("Worker transcript commit row has no sequence head");
  if (
    params.head.environment_id !== params.input.environmentId ||
    params.commit.request_hash !== params.input.requestHash
  )
    return {
      kind: "rejected",
      reason: "conflict",
    };
  if (params.commit.state === "pending") return { kind: "recover" };
  if (params.commit.state === "terminal" && params.commit.result_json !== null)
    return {
      kind: "replay",
      outcome: parseOutcomeJson(params.commit.result_json),
    };
  throw new Error("Worker transcript commit row has invalid terminal state");
}
function insertHead(db, input) {
  const head = {
    session_id: input.sessionId,
    run_epoch: input.runEpoch,
    environment_id: input.environmentId,
    next_seq: 1,
    updated_at_ms: input.nowMs,
  };
  executeSqliteQuerySync(db, query(db).insertInto("worker_transcript_commit_heads").values(head));
}
function insertPendingCommit(db, input) {
  const commit = {
    session_id: input.sessionId,
    run_epoch: input.runEpoch,
    seq: input.seq,
    request_hash: input.requestHash,
    state: "pending",
    result_json: null,
    created_at_ms: input.nowMs,
    updated_at_ms: input.nowMs,
  };
  executeSqliteQuerySync(db, query(db).insertInto("worker_transcript_commits").values(commit));
}
function createWorkerTranscriptCommitStore(options = {}) {
  const path = (options.database ?? openOpenClawStateDatabase()).path;
  const now = options.now ?? Date.now;
  const write = (operation) =>
    runOpenClawStateWriteTransaction(({ db }) => operation(db), { path });
  const begin = (rawInput) => {
    const input = normalizeInput(rawInput, now());
    return write((db) => {
      const head = findHead(db, input);
      const existing = classifyExistingCommit({
        head,
        commit: findCommit(db, input),
        input,
      });
      if (existing) return existing;
      if (head && head.environment_id !== input.environmentId)
        return {
          kind: "rejected",
          reason: "conflict",
        };
      const expectedSeq = head?.next_seq ?? 1;
      if (input.seq !== expectedSeq)
        return {
          kind: "rejected",
          reason: "out-of-order",
          expectedSeq,
        };
      if (!head) insertHead(db, input);
      insertPendingCommit(db, input);
      return { kind: "claimed" };
    });
  };
  const complete = (rawInput) => {
    const input = normalizeInput(rawInput, now());
    const resultJson = serializeOutcome(rawInput.outcome);
    return write((db) => {
      const head = findHead(db, input);
      const existing = classifyExistingCommit({
        head,
        commit: findCommit(db, input),
        input,
      });
      if (!existing)
        throw new Error("Worker transcript commit must begin before terminal completion");
      if (existing.kind === "rejected")
        throw new Error(
          `Worker transcript commit terminal completion rejected: ${existing.reason}`,
        );
      if (existing.kind === "replay") return existing.outcome;
      if (!head) throw new Error("Worker transcript commit row has no sequence head");
      if (head.next_seq !== input.seq)
        throw new Error(
          `Worker transcript commit terminal completion expected sequence ${head.next_seq}`,
        );
      if (
        executeSqliteQuerySync(
          db,
          query(db)
            .updateTable("worker_transcript_commits")
            .set({
              state: "terminal",
              result_json: resultJson,
              updated_at_ms: input.nowMs,
            })
            .where("session_id", "=", input.sessionId)
            .where("run_epoch", "=", input.runEpoch)
            .where("seq", "=", input.seq)
            .where("request_hash", "=", input.requestHash)
            .where("state", "=", "pending"),
        ).numAffectedRows !== 1n
      )
        throw new Error("Worker transcript commit changed during terminal completion");
      if (
        executeSqliteQuerySync(
          db,
          query(db)
            .updateTable("worker_transcript_commit_heads")
            .set({
              next_seq: input.seq + 1,
              updated_at_ms: input.nowMs,
            })
            .where("session_id", "=", input.sessionId)
            .where("run_epoch", "=", input.runEpoch)
            .where("environment_id", "=", input.environmentId)
            .where("next_seq", "=", input.seq),
        ).numAffectedRows !== 1n
      )
        throw new Error("Worker transcript commit sequence changed during terminal completion");
      return rawInput.outcome;
    });
  };
  return {
    begin,
    complete,
  };
}
//#endregion
//#region src/gateway/worker-environments/transcript-commit.ts
function cloneContentPart(part) {
  if (part.type === "text")
    return {
      type: "text",
      text: part.text,
      ...(part.textSignature ? { textSignature: part.textSignature } : {}),
    };
  if (part.type === "image")
    return {
      type: "image",
      data: part.data,
      mimeType: part.mimeType,
    };
  if (part.type === "thinking")
    return {
      type: "thinking",
      thinking: part.thinking,
      ...(part.thinkingSignature ? { thinkingSignature: part.thinkingSignature } : {}),
      ...(part.redacted === void 0 ? {} : { redacted: part.redacted }),
    };
  return {
    type: "toolCall",
    id: part.id,
    name: part.name,
    arguments: structuredClone(part.arguments),
    ...(part.thoughtSignature ? { thoughtSignature: part.thoughtSignature } : {}),
    ...(part.executionMode ? { executionMode: part.executionMode } : {}),
  };
}
function buildCommittedMessage(message, idempotencyKey) {
  const content = message.content.map((part) => cloneContentPart(part));
  if (message.role === "user")
    return {
      role: "user",
      content,
      timestamp: message.timestamp,
      idempotencyKey,
    };
  if (message.role === "toolResult")
    return {
      role: "toolResult",
      toolCallId: message.toolCallId,
      toolName: message.toolName,
      content,
      ...(message.details === void 0 ? {} : { details: structuredClone(message.details) }),
      isError: message.isError,
      timestamp: message.timestamp,
      idempotencyKey,
    };
  return {
    role: "assistant",
    content,
    api: message.api,
    provider: message.provider,
    model: message.model,
    ...(message.responseModel ? { responseModel: message.responseModel } : {}),
    ...(message.responseId ? { responseId: message.responseId } : {}),
    ...(message.diagnostics
      ? {
          diagnostics: message.diagnostics.map((diagnostic) => ({
            type: diagnostic.type,
            timestamp: diagnostic.timestamp,
            ...(diagnostic.error
              ? {
                  error: {
                    ...(diagnostic.error.name === void 0 ? {} : { name: diagnostic.error.name }),
                    message: diagnostic.error.message,
                    ...(diagnostic.error.stack === void 0 ? {} : { stack: diagnostic.error.stack }),
                    ...(diagnostic.error.code === void 0 ? {} : { code: diagnostic.error.code }),
                  },
                }
              : {}),
            ...(diagnostic.details ? { details: structuredClone(diagnostic.details) } : {}),
          })),
        }
      : {}),
    usage: {
      input: message.usage.input,
      output: message.usage.output,
      cacheRead: message.usage.cacheRead,
      cacheWrite: message.usage.cacheWrite,
      ...(message.usage.contextUsage
        ? { contextUsage: structuredClone(message.usage.contextUsage) }
        : {}),
      totalTokens: message.usage.totalTokens,
      cost: {
        input: message.usage.cost.input,
        output: message.usage.cost.output,
        cacheRead: message.usage.cost.cacheRead,
        cacheWrite: message.usage.cost.cacheWrite,
        total: message.usage.cost.total,
        ...(message.usage.cost.totalOrigin ? { totalOrigin: message.usage.cost.totalOrigin } : {}),
      },
    },
    stopReason: message.stopReason,
    ...(message.errorMessage === void 0 ? {} : { errorMessage: message.errorMessage }),
    ...(message.errorCode === void 0 ? {} : { errorCode: message.errorCode }),
    ...(message.errorType === void 0 ? {} : { errorType: message.errorType }),
    ...(message.errorBody === void 0 ? {} : { errorBody: message.errorBody }),
    timestamp: message.timestamp,
    idempotencyKey,
  };
}
function requestHash(request) {
  return createHash("sha256")
    .update(
      stableStringify({
        baseLeafId: request.baseLeafId,
        messages: request.messages,
      }),
    )
    .digest("hex");
}
function messageIdempotencyKey(params) {
  return `worker-commit-${createHash("sha256")
    .update([params.sessionId, params.runEpoch, params.seq, params.index].join("\0"))
    .digest("base64url")}`;
}
function readMessageIdempotencyKey(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return;
  const value = message.idempotencyKey;
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function isCommittedAgentMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return false;
  const role = message.role;
  return (
    (role === "user" || role === "assistant" || role === "toolResult") &&
    readMessageIdempotencyKey(message) !== void 0
  );
}
function resolveActiveCommitPrefix(params) {
  const activeBranch = params.manager.getBranch();
  const activeVisibleEntryCount = activeBranch.filter(
    (entry) => entry.type === "message" || entry.type === "compaction",
  ).length;
  if (params.manager.getLeafId() === params.baseLeafId)
    return {
      activeVisibleEntryCount,
      ok: true,
      recoveredMessages: [],
    };
  const baseIndex =
    params.baseLeafId === null
      ? -1
      : activeBranch.findIndex((entry) => entry.id === params.baseLeafId);
  if (params.baseLeafId !== null && baseIndex < 0) return { ok: false };
  const activeSuffix = activeBranch.slice(baseIndex + 1);
  if (activeSuffix.length === 0) return { ok: false };
  const recoveredMessages = [];
  for (const [index, entry] of activeSuffix.slice(0, params.messages.length).entries()) {
    const expectedKey = readMessageIdempotencyKey(params.messages[index]);
    if (
      entry.type !== "message" ||
      !expectedKey ||
      !isCommittedAgentMessage(entry.message) ||
      readMessageIdempotencyKey(entry.message) !== expectedKey
    )
      return { ok: false };
    recoveredMessages.push({
      appended: false,
      message: entry.message,
      messageId: entry.id,
    });
  }
  return {
    activeVisibleEntryCount,
    ok: true,
    recoveredMessages,
  };
}
function resolvePersistedCommitAcrossDag(params) {
  const childrenByParent = /* @__PURE__ */ new Map();
  for (const entry of params.manager.getEntries()) {
    const children = childrenByParent.get(entry.parentId) ?? [];
    children.push(entry);
    childrenByParent.set(entry.parentId, children);
  }
  const completedPaths = [];
  const visit = (parentId, messageIndex, path) => {
    if (completedPaths.length > 1) return;
    if (messageIndex === params.messages.length) {
      completedPaths.push(path);
      return;
    }
    const expectedKey = readMessageIdempotencyKey(params.messages[messageIndex]);
    if (!expectedKey) return;
    for (const entry of childrenByParent.get(parentId) ?? []) {
      if (
        entry.type !== "message" ||
        !isCommittedAgentMessage(entry.message) ||
        readMessageIdempotencyKey(entry.message) !== expectedKey
      )
        continue;
      visit(entry.id, messageIndex + 1, [
        ...path,
        {
          appended: false,
          message: entry.message,
          messageId: entry.id,
        },
      ]);
    }
  };
  visit(params.baseLeafId, 0, []);
  if (completedPaths.length > 1) return { kind: "ambiguous" };
  const messages = completedPaths[0];
  return messages
    ? {
        kind: "found",
        messages,
      }
    : { kind: "missing" };
}
async function applyWorkerTranscriptCommit(params) {
  const redactedMessages = params.messages.map((message) =>
    redactTranscriptMessage(message, params.config),
  );
  const applied = await withTranscriptWriteTransaction(params.target, ({ sessionFile }) => {
    const currentEntry = loadSessionEntry(params.target);
    if (!currentEntry || currentEntry.sessionId !== params.sessionId)
      return {
        ok: false,
        reason: "session-not-attached",
      };
    const manager = SessionManager.open(sessionFile);
    if (params.recoverPersistedBatch) {
      const recovered = resolvePersistedCommitAcrossDag({
        baseLeafId: params.requestedBaseLeafId,
        manager,
        messages: redactedMessages,
      });
      if (recovered.kind === "found")
        return {
          ok: true,
          messages: recovered.messages,
        };
      if (recovered.kind === "ambiguous")
        return {
          ok: false,
          reason: "invalid-batch",
        };
    }
    const prefix = resolveActiveCommitPrefix({
      baseLeafId: params.requestedBaseLeafId,
      manager,
      messages: redactedMessages,
    });
    if (!prefix.ok)
      return {
        ok: false,
        reason: "stale-base-leaf",
      };
    const messages = [...prefix.recoveredMessages];
    let nextMessageSeq = prefix.activeVisibleEntryCount;
    for (const message of redactedMessages.slice(prefix.recoveredMessages.length)) {
      const messageId = manager.appendMessage(message, {
        config: params.config,
        idempotencyLookup: "caller-checked",
      });
      nextMessageSeq += 1;
      messages.push({
        appended: true,
        message,
        messageId,
        messageSeq: nextMessageSeq,
      });
    }
    const freshEntry = loadSessionEntry(params.target);
    if (!freshEntry || freshEntry.sessionId !== params.sessionId)
      return {
        ok: false,
        reason: "session-not-attached",
      };
    const appendedCount = messages.filter((message) => message.appended).length;
    const nextEntry = {
      ...freshEntry,
      sessionFile,
      ...(appendedCount > 0 ? { updatedAt: Math.max(freshEntry.updatedAt ?? 0, Date.now()) } : {}),
    };
    replaceSessionEntrySync(params.target, nextEntry);
    return {
      ok: true,
      messages,
    };
  });
  if (!applied.ok) return applied;
  for (const message of applied.messages) {
    if (!message.appended) continue;
    await publishTranscriptUpdate(params.target, {
      message: message.message,
      messageId: message.messageId,
      messageSeq: message.messageSeq,
    });
  }
  return applied;
}
/** Applies ordered, idempotent semantic worker turns to the canonical session transcript. */
function createWorkerTranscriptCommitter(options) {
  const store = options.store ?? createWorkerTranscriptCommitStore();
  const sessionOperations = new KeyedAsyncQueue();
  const commit = async (params) => {
    const sessionId = params.identity.sessionId;
    if (!sessionId)
      return {
        ok: false,
        reason: "session-not-attached",
      };
    if (params.request.runEpoch !== params.identity.ownerEpoch)
      return {
        ok: false,
        reason: "epoch-mismatch",
      };
    return await sessionOperations.enqueue(sessionId, async () => {
      const input = {
        environmentId: params.identity.environmentId,
        sessionId,
        runEpoch: params.request.runEpoch,
        seq: params.request.seq,
        requestHash: requestHash(params.request),
      };
      const started = store.begin(input);
      if (started.kind === "replay") return started.outcome;
      if (started.kind === "rejected")
        return {
          ok: false,
          reason: "invalid-batch",
        };
      const config = options.getConfig();
      const target = resolveWorkerSessionTarget(config, sessionId);
      if (!target)
        return store.complete({
          ...input,
          outcome: {
            ok: false,
            reason: "session-not-attached",
          },
        });
      const applied = await applyWorkerTranscriptCommit({
        config,
        messages: params.request.messages.map((message, index) =>
          buildCommittedMessage(
            message,
            messageIdempotencyKey({
              sessionId,
              runEpoch: params.request.runEpoch,
              seq: params.request.seq,
              index,
            }),
          ),
        ),
        recoverPersistedBatch: started.kind === "recover",
        requestedBaseLeafId: params.request.baseLeafId,
        sessionId,
        target,
      });
      if (!applied.ok)
        return store.complete({
          ...input,
          outcome: {
            ok: false,
            reason: applied.reason,
          },
        });
      const entryIds = applied.messages.map((message) => message.messageId);
      const newLeafId = entryIds.at(-1);
      if (entryIds.length !== params.request.messages.length || !newLeafId)
        return store.complete({
          ...input,
          outcome: {
            ok: false,
            reason: "invalid-batch",
          },
        });
      return store.complete({
        ...input,
        outcome: {
          ok: true,
          result: {
            entryIds,
            newLeafId,
          },
        },
      });
    });
  };
  return { commit };
}
//#endregion
export { createWorkerTranscriptCommitter };
