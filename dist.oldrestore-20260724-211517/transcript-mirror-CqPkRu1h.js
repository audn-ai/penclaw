import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-jOYXwwnX.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./agent-harness-runtime-BjY9gsEs.js";
import { t as log } from "./logger-C5RMMskO.js";
import {
  l as withSessionTranscriptWriteLock,
  r as publishSessionTranscriptUpdateByIdentity,
} from "./session-transcript-runtime-B2hvNHEH.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/codex/src/app-server/upstream-prompt-provenance.ts
const UPSTREAM_USER_TEXT_META_KEY = "upstreamUserText";
const MIRROR_IDENTITY_META_KEY = "mirrorIdentity";
function attachCodexMirrorIdentity(message, identity) {
  const record = message;
  const existing = record["__openclaw"];
  const baseMeta =
    existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
  return {
    ...record,
    __openclaw: {
      ...baseMeta,
      [MIRROR_IDENTITY_META_KEY]: identity,
    },
  };
}
function readMirrorIdentity(message) {
  const meta = message["__openclaw"];
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
  const id = meta[MIRROR_IDENTITY_META_KEY];
  return typeof id === "string" && id ? id : void 0;
}
function attachUpstreamUserText(message, text) {
  const record = message;
  const existing = record["__openclaw"];
  const baseMeta =
    existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
  return {
    ...record,
    __openclaw: {
      ...baseMeta,
      [UPSTREAM_USER_TEXT_META_KEY]: text,
    },
  };
}
function readUpstreamUserText(message) {
  const meta = message?.["__openclaw"];
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
  const text = meta[UPSTREAM_USER_TEXT_META_KEY];
  return typeof text === "string" && text ? text : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/user-prompt-message.ts
function buildSenderLabel(params) {
  const label = params.senderName ?? params.senderUsername ?? params.senderE164 ?? params.senderId;
  if (!label) return;
  return !params.senderId || label.includes(params.senderId)
    ? label
    : `${label} (${params.senderId})`;
}
function buildFromPrepared(params, preparedUserMessage) {
  const senderId = normalizeOptionalString(params.senderId);
  const senderName = normalizeOptionalString(params.senderName);
  const senderUsername = normalizeOptionalString(params.senderUsername);
  const senderE164 = normalizeOptionalString(params.senderE164);
  const senderLabel = buildSenderLabel({
    senderId,
    senderName,
    senderUsername,
    senderE164,
  });
  const sourceChannel = normalizeOptionalString(
    params.inputProvenance?.sourceChannel ?? params.messageChannel ?? params.messageProvider,
  );
  return {
    role: "user",
    timestamp: Date.now(),
    ...(params.inputProvenance ? { provenance: params.inputProvenance } : {}),
    ...(sourceChannel ? { sourceChannel } : {}),
    ...(senderId ? { senderId } : {}),
    ...(senderName ? { senderName } : {}),
    ...(senderUsername ? { senderUsername } : {}),
    ...(senderE164 ? { senderE164 } : {}),
    ...(senderLabel ? { senderLabel } : {}),
    ...(preparedUserMessage ? preparedUserMessage : { content: params.prompt }),
  };
}
function buildCodexUserPromptMessage(params) {
  return buildFromPrepared(params, params.userTurnTranscriptRecorder?.message);
}
function buildCodexUpstreamPromptMessage(params, identity, upstreamUserText) {
  const message = attachCodexMirrorIdentity(buildCodexUserPromptMessage(params), identity);
  return upstreamUserText ? attachUpstreamUserText(message, upstreamUserText) : message;
}
function promptSnapshot(params, turnId, upstreamUserText) {
  return params.suppressNextUserMessagePersistence
    ? []
    : [buildCodexUpstreamPromptMessage(params, `${turnId}:prompt`, upstreamUserText)];
}
async function buildResolvedCodexUserPromptMessage(params) {
  return buildFromPrepared(
    params,
    (await params.userTurnTranscriptRecorder?.resolveMessage()) ??
      params.userTurnTranscriptRecorder?.message,
  );
}
//#endregion
//#region extensions/codex/src/app-server/transcript-mirror.ts
const MIRROR_ORIGIN_META_KEY = "mirrorOrigin";
const CODEX_APP_SERVER_MIRROR_ORIGIN = "codex-app-server";
const CODEX_HISTORY_IMPORT_MAX_MESSAGES = 200;
const CODEX_HISTORY_IMPORT_MAX_BYTES = 512 * 1024;
const CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES = 64 * 1024;
const CODEX_HISTORY_TRUNCATION_SUFFIX = "\n\n[Message truncated during Codex history import.]";
const CODEX_HISTORY_ASSISTANT_API = "openai-chatgpt-responses";
const CODEX_HISTORY_ASSISTANT_PROVIDER = "openai";
const CODEX_HISTORY_ASSISTANT_MODEL = "native-history";
const CODEX_HISTORY_ZERO_USAGE = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    total: 0,
  },
};
function isUtf8ContinuationByte(byte) {
  return byte !== void 0 && (byte & 192) === 128;
}
function truncateUtf8Prefix(value, maxBytes) {
  const bytes = Buffer.from(value);
  if (bytes.byteLength <= maxBytes) return value;
  let end = Math.max(0, maxBytes);
  while (end > 0 && isUtf8ContinuationByte(bytes[end])) end -= 1;
  return bytes.subarray(0, end).toString("utf8");
}
function normalizeImportedHistoryText(value) {
  if (typeof value !== "string") return;
  const text = value.trim();
  if (!text) return;
  if (Buffer.byteLength(text, "utf8") <= CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES) return text;
  const suffixBytes = Buffer.byteLength(CODEX_HISTORY_TRUNCATION_SUFFIX, "utf8");
  return `${truncateUtf8Prefix(text, Math.max(0, CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES - suffixBytes))}${CODEX_HISTORY_TRUNCATION_SUFFIX}`;
}
function projectCodexUserItemText(item) {
  if (!Array.isArray(item.content)) return;
  const parts = [];
  for (const value of item.content) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const input = value;
    if (input.type === "text") {
      const text = normalizeImportedHistoryText(input.text);
      if (text) parts.push(text);
      continue;
    }
    if (input.type === "image" || input.type === "localImage") {
      parts.push("[Image attachment]");
      continue;
    }
    if (input.type === "skill" || input.type === "mention") {
      const name = normalizeOptionalString(input.name);
      if (name) parts.push(`${input.type === "skill" ? "$" : "@"}${name}`);
    }
  }
  return normalizeImportedHistoryText(parts.join("\n"));
}
function selectTurnsThroughBoundary(thread, throughTurnId) {
  if (throughTurnId === null) return [];
  const turns = thread.turns ?? [];
  const boundaryIndex = turns.findIndex((turn) => turn.id === throughTurnId);
  if (boundaryIndex < 0) throw new Error(`Codex history boundary turn not found: ${throughTurnId}`);
  const boundary = turns[boundaryIndex];
  if (
    boundary?.status !== "completed" &&
    boundary?.status !== "interrupted" &&
    boundary?.status !== "failed"
  )
    throw new Error(`Codex history boundary turn is not terminal: ${throughTurnId}`);
  return turns.slice(0, boundaryIndex + 1);
}
function projectCodexThreadHistory(params) {
  const projected = [];
  const threadTimestamp =
    typeof params.thread.createdAt === "number" && Number.isFinite(params.thread.createdAt)
      ? params.thread.createdAt * 1e3
      : params.importedAt;
  let itemOffset = 0;
  for (const turn of selectTurnsThroughBoundary(params.thread, params.throughTurnId))
    for (const value of turn.items) {
      const item = value;
      const itemId = normalizeOptionalString(item.id);
      const identity = `${turn.id}:${itemId ?? itemOffset}`;
      const timestampSeconds =
        item.type === "agentMessage"
          ? (turn.completedAt ?? turn.startedAt)
          : (turn.startedAt ?? turn.completedAt);
      const timestamp =
        typeof timestampSeconds === "number" && Number.isFinite(timestampSeconds)
          ? timestampSeconds * 1e3 + itemOffset
          : threadTimestamp + itemOffset;
      const text =
        item.type === "userMessage"
          ? projectCodexUserItemText(item)
          : item.type === "agentMessage"
            ? normalizeImportedHistoryText(item.text)
            : void 0;
      const role =
        item.type === "userMessage" ? "user" : item.type === "agentMessage" ? "assistant" : void 0;
      itemOffset += 1;
      if (!text || !role) continue;
      const message =
        role === "assistant"
          ? attachCodexMirrorIdentity(
              {
                role,
                content: [
                  {
                    type: "text",
                    text,
                  },
                ],
                api: CODEX_HISTORY_ASSISTANT_API,
                provider:
                  normalizeOptionalString(params.modelProvider) ??
                  normalizeOptionalString(params.thread.modelProvider) ??
                  CODEX_HISTORY_ASSISTANT_PROVIDER,
                model: CODEX_HISTORY_ASSISTANT_MODEL,
                usage: CODEX_HISTORY_ZERO_USAGE,
                stopReason: "stop",
                timestamp,
              },
              identity,
            )
          : attachCodexMirrorIdentity(
              {
                role,
                content: text,
                timestamp,
              },
              identity,
            );
      const phase =
        item.phase === "commentary" || item.phase === "final_answer" ? item.phase : void 0;
      projected.push({
        message,
        responseItem: {
          type: "message",
          role,
          content: [
            {
              type: role === "assistant" ? "output_text" : "input_text",
              text,
            },
          ],
          ...(role === "assistant" && phase ? { phase } : {}),
        },
        textBytes: Buffer.byteLength(text, "utf8"),
      });
    }
  return projected;
}
function selectBoundedCodexHistoryTail(projected) {
  const selected = [];
  let selectedBytes = 0;
  for (let index = projected.length - 1; index >= 0; index -= 1) {
    const candidate = projected[index];
    if (!candidate) continue;
    if (
      selected.length >= CODEX_HISTORY_IMPORT_MAX_MESSAGES ||
      selectedBytes + candidate.textBytes > CODEX_HISTORY_IMPORT_MAX_BYTES
    )
      break;
    selected.push(candidate);
    selectedBytes += candidate.textBytes;
  }
  return selected.toReversed();
}
/** Projects one terminal Codex history prefix into transcript and Responses API items. */
function projectBoundedCodexThreadHistory(params) {
  const projected = projectCodexThreadHistory({
    thread: params.thread,
    throughTurnId: params.throughTurnId,
    importedAt: params.importedAt,
    ...(params.modelProvider ? { modelProvider: params.modelProvider } : {}),
  });
  const selected = selectBoundedCodexHistoryTail(projected);
  return {
    importedMessages: selected.length,
    omittedMessages: projected.length - selected.length,
    responseItems: selected.map(({ responseItem }) => responseItem),
    transcriptMessages: selected.map(({ message }) => message),
  };
}
/** Imports a bounded, user-visible Codex history tail into a new OpenClaw transcript. */
async function importCodexThreadHistoryToTranscript(params) {
  const projection = projectBoundedCodexThreadHistory({
    thread: params.thread,
    throughTurnId: params.throughTurnId,
    importedAt: Date.now(),
    ...(params.modelProvider ? { modelProvider: params.modelProvider } : {}),
  });
  if (projection.transcriptMessages.length > 0)
    await mirror({
      storePath: params.storePath,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      ...(params.agentId ? { agentId: params.agentId } : {}),
      ...(params.cwd ? { cwd: params.cwd } : {}),
      ...(params.config ? { config: params.config } : {}),
      messages: projection.transcriptMessages,
      idempotencyScope: `codex-app-server:${params.thread.id}:history`,
    });
  return {
    importedMessages: projection.importedMessages,
    omittedMessages: projection.omittedMessages,
  };
}
function attachCodexMirrorOrigin(message) {
  const record = message;
  const existing = record["__openclaw"];
  const baseMeta =
    existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
  return {
    ...record,
    __openclaw: {
      ...baseMeta,
      [MIRROR_ORIGIN_META_KEY]: CODEX_APP_SERVER_MIRROR_ORIGIN,
    },
  };
}
async function mirrorBestEffort(params) {
  try {
    const messages = await resolveFinalCodexMirrorMessages({
      params: params.params,
      messagesSnapshot: params.result.messagesSnapshot,
      turnId: params.turnId,
    });
    const mirrorResult = await mirror({
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      sessionId: params.params.sessionId,
      storePath: params.params.sessionTarget?.storePath,
      cwd: params.cwd,
      messages,
      idempotencyScope: `codex-app-server:${params.threadId}`,
      config: params.params.config,
    });
    for (const message of mirrorResult.userMessagesPresent)
      try {
        params.notifyUserMessagePersisted(message);
      } catch (error) {
        log.warn("failed to notify codex app-server user-message persistence", {
          error: formatErrorMessage(error),
        });
      }
    return mirrorResult.assistantMirrorIdentitiesOwned.includes(`${params.turnId}:assistant`);
  } catch (error) {
    log.warn("failed to mirror codex app-server transcript", { error });
    return false;
  }
}
async function resolveFinalCodexMirrorMessages(params) {
  if (params.params.suppressNextUserMessagePersistence || !params.params.userTurnTranscriptRecorder)
    return params.messagesSnapshot;
  const promptSnapshot = params.messagesSnapshot.find((message) => message.role === "user");
  const resolvedBase = attachCodexMirrorIdentity(
    await buildResolvedCodexUserPromptMessage(params.params),
    `${params.turnId}:prompt`,
  );
  const upstreamUserText = readUpstreamUserText(promptSnapshot);
  const resolvedPrompt = upstreamUserText
    ? attachUpstreamUserText(resolvedBase, upstreamUserText)
    : resolvedBase;
  const firstUserIndex = params.messagesSnapshot.findIndex((message) => message.role === "user");
  if (firstUserIndex === -1) return [resolvedPrompt, ...params.messagesSnapshot];
  const messages = params.messagesSnapshot.slice();
  messages[firstUserIndex] = resolvedPrompt;
  return messages;
}
function createCodexAppServerUserMessagePersistenceNotifier(runParams) {
  let notified = false;
  return (message) => {
    if (notified) return;
    notified = true;
    runParams.userTurnTranscriptRecorder?.markRuntimePersisted(message);
    try {
      runParams.onUserMessagePersisted?.(message);
    } catch (error) {
      log.warn("codex app-server user persistence notification failed", {
        error: formatErrorMessage(error),
      });
    }
  };
}
async function mirrorPromptAtTurnStartBestEffort(params) {
  if (params.params.suppressNextUserMessagePersistence) return;
  try {
    const mirrorPromise = (async () => {
      const userPromptMessage = attachUpstreamUserText(
        attachCodexMirrorIdentity(
          await buildResolvedCodexUserPromptMessage(params.params),
          `${params.turnId}:prompt`,
        ),
        params.upstreamUserText,
      );
      const mirrorResult = await mirror({
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        sessionId: params.params.sessionId,
        storePath: params.params.sessionTarget?.storePath,
        cwd: params.cwd,
        messages: [userPromptMessage],
        idempotencyScope: `codex-app-server:${params.threadId}`,
        config: params.params.config,
      });
      for (const message of mirrorResult.userMessagesPresent)
        params.notifyUserMessagePersisted(message);
    })();
    params.params.userTurnTranscriptRecorder?.markRuntimePersistencePending(mirrorPromise);
    await mirrorPromise;
  } catch (error) {
    log.warn("failed to mirror codex app-server prompt at turn start", { error });
  }
}
function fingerprintMirrorMessageContent(message) {
  const payload = JSON.stringify({
    role: message.role,
    content: message.content,
  });
  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}
function buildMirrorDedupeIdentity(message) {
  const explicit = readMirrorIdentity(message);
  if (explicit) return explicit;
  return `${message.role}:${fingerprintMirrorMessageContent(message)}`;
}
async function mirror(params) {
  const messages = params.messages.filter(
    (message) =>
      message.role === "user" || message.role === "assistant" || message.role === "toolResult",
  );
  if (messages.length === 0)
    return {
      assistantMirrorIdentitiesOwned: [],
      userMessagesPresent: [],
    };
  const transcriptTarget = resolveCodexMirrorTranscriptTarget(params);
  const { appendedUpdates, assistantMirrorIdentitiesOwned, userMessagesPresent } =
    await withSessionTranscriptWriteLock(
      {
        ...transcriptTarget,
        config: params.config,
      },
      async (transcript) => {
        const nextAppendedUpdates = [];
        const nextAssistantMirrorIdentitiesOwned = /* @__PURE__ */ new Set();
        const nextUserMessagesPresent = [];
        const mirrorState = readTranscriptMirrorState(await transcript.readEvents());
        let nextMessageSeq = mirrorState.messageCount;
        for (const message of messages) {
          const dedupeIdentity = buildMirrorDedupeIdentity(message);
          const idempotencyKey =
            (message.role === "user" ? normalizeOptionalString(message.idempotencyKey) : void 0) ??
            (params.idempotencyScope ? `${params.idempotencyScope}:${dedupeIdentity}` : void 0);
          const transcriptMessage = {
            ...attachCodexMirrorOrigin(message),
            ...(idempotencyKey ? { idempotencyKey } : {}),
          };
          if (idempotencyKey && mirrorState.idempotencyKeys.has(idempotencyKey)) {
            const persistedUserMessage =
              mirrorState.userMessagesByIdempotencyKey.get(idempotencyKey);
            if (persistedUserMessage) nextUserMessagesPresent.push(persistedUserMessage);
            if (message.role === "assistant")
              nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
            continue;
          }
          const nextMessage = runAgentHarnessBeforeMessageWriteHook({
            message: transcriptMessage,
            agentId: params.agentId,
            sessionKey: params.sessionKey,
          });
          if (!nextMessage) {
            if (message.role === "assistant")
              nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
            continue;
          }
          const messageToAppend = idempotencyKey
            ? {
                ...attachCodexMirrorOrigin(nextMessage),
                idempotencyKey,
              }
            : attachCodexMirrorOrigin(nextMessage);
          const appended = await transcript.appendMessage({
            message: messageToAppend,
            idempotencyLookup: idempotencyKey ? "caller-checked" : "scan",
            cwd: params.cwd,
          });
          if (!appended) continue;
          const { messageId, message: appendedMessage } = appended;
          if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
          if (appendedMessage.role === "user") {
            nextUserMessagesPresent.push(appendedMessage);
            if (idempotencyKey)
              mirrorState.userMessagesByIdempotencyKey.set(idempotencyKey, appendedMessage);
          }
          nextMessageSeq += 1;
          nextAppendedUpdates.push({
            messageId,
            message: appendedMessage,
            messageSeq: nextMessageSeq,
          });
          if (idempotencyKey) mirrorState.idempotencyKeys.add(idempotencyKey);
        }
        return {
          appendedUpdates: nextAppendedUpdates,
          assistantMirrorIdentitiesOwned: [...nextAssistantMirrorIdentitiesOwned],
          userMessagesPresent: nextUserMessagesPresent,
        };
      },
    );
  for (const update of appendedUpdates)
    try {
      await publishSessionTranscriptUpdateByIdentity({
        ...transcriptTarget,
        update: {
          ...(params.agentId ? { agentId: params.agentId } : {}),
          message: update.message,
          messageId: update.messageId,
          messageSeq: update.messageSeq,
          sessionKey: transcriptTarget.sessionKey,
        },
      });
    } catch (error) {
      log.warn("failed to publish codex app-server transcript update", {
        error: formatErrorMessage(error),
      });
    }
  return {
    assistantMirrorIdentitiesOwned,
    userMessagesPresent,
  };
}
const codexTranscriptMirrorRuntime = {
  mirror,
  mirrorBestEffort,
};
function resolveCodexMirrorTranscriptTarget(params) {
  const sessionKey = params.sessionKey?.trim();
  const storePath = params.storePath?.trim();
  if (!sessionKey || !storePath)
    throw new Error("Codex transcript mirror requires a runtime session identity");
  return {
    ...(params.agentId ? { agentId: params.agentId } : {}),
    sessionId: params.sessionId,
    sessionKey,
    storePath,
  };
}
function readTranscriptMirrorState(events) {
  const idempotencyKeys = /* @__PURE__ */ new Set();
  const userMessagesByIdempotencyKey = /* @__PURE__ */ new Map();
  let messageCount = 0;
  for (const event of events) {
    if (!event || typeof event !== "object" || Array.isArray(event)) continue;
    const parsed = event;
    if (parsed.type === "message") messageCount += 1;
    if (typeof parsed.message?.idempotencyKey === "string") {
      idempotencyKeys.add(parsed.message.idempotencyKey);
      if (parsed.message.role === "user")
        userMessagesByIdempotencyKey.set(parsed.message.idempotencyKey, parsed.message);
    }
  }
  return {
    idempotencyKeys,
    messageCount,
    userMessagesByIdempotencyKey,
  };
}
//#endregion
export {
  projectBoundedCodexThreadHistory as a,
  attachCodexMirrorIdentity as c,
  mirrorPromptAtTurnStartBestEffort as i,
  createCodexAppServerUserMessagePersistenceNotifier as n,
  buildCodexUserPromptMessage as o,
  importCodexThreadHistoryToTranscript as r,
  promptSnapshot as s,
  codexTranscriptMirrorRuntime as t,
};
