import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
import {
  At as boolean,
  Bt as discriminatedUnion,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
  Zn as unknown,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
//#region extensions/voice-call/src/types.ts
const ProviderNameSchema = _enum(["telnyx", "twilio", "plivo", "mock"]);
const CallStateSchema = _enum([
  "initiated",
  "ringing",
  "answered",
  "active",
  "speaking",
  "listening",
  "completed",
  "hangup-user",
  "hangup-bot",
  "timeout",
  "error",
  "failed",
  "no-answer",
  "busy",
  "voicemail",
]);
const TerminalStates = /* @__PURE__ */ new Set([
  "completed",
  "hangup-user",
  "hangup-bot",
  "timeout",
  "error",
  "failed",
  "no-answer",
  "busy",
  "voicemail",
]);
const EndReasonSchema = _enum([
  "completed",
  "hangup-user",
  "hangup-bot",
  "timeout",
  "error",
  "failed",
  "no-answer",
  "busy",
  "voicemail",
]);
const BaseEventSchema = object({
  id: string(),
  dedupeKey: string().optional(),
  callId: string(),
  providerCallId: string().optional(),
  timestamp: number(),
  turnToken: string().optional(),
  direction: _enum(["inbound", "outbound"]).optional(),
  from: string().optional(),
  to: string().optional(),
});
discriminatedUnion("type", [
  BaseEventSchema.extend({ type: literal("call.initiated") }),
  BaseEventSchema.extend({ type: literal("call.ringing") }),
  BaseEventSchema.extend({ type: literal("call.answered") }),
  BaseEventSchema.extend({ type: literal("call.active") }),
  BaseEventSchema.extend({
    type: literal("call.speaking"),
    text: string(),
  }),
  BaseEventSchema.extend({
    type: literal("call.assistant-speech"),
    transcript: string(),
  }),
  BaseEventSchema.extend({
    type: literal("call.speech"),
    transcript: string(),
    isFinal: boolean(),
    confidence: number().min(0).max(1).optional(),
  }),
  BaseEventSchema.extend({
    type: literal("call.silence"),
    durationMs: number(),
  }),
  BaseEventSchema.extend({
    type: literal("call.dtmf"),
    digits: string(),
  }),
  BaseEventSchema.extend({
    type: literal("call.ended"),
    reason: EndReasonSchema,
  }),
  BaseEventSchema.extend({
    type: literal("call.error"),
    error: string(),
    retryable: boolean().optional(),
  }),
]);
const CallDirectionSchema = _enum(["outbound", "inbound"]);
const TranscriptEntrySchema = object({
  timestamp: number(),
  speaker: _enum(["bot", "user"]),
  text: string(),
  isFinal: boolean().default(true),
});
const CallRecordSchema = object({
  callId: string(),
  providerCallId: string().optional(),
  provider: ProviderNameSchema,
  direction: CallDirectionSchema,
  state: CallStateSchema,
  from: string(),
  to: string(),
  sessionKey: string().optional(),
  /** Agent selected when the call was created. Optional for legacy records. */
  agentId: string().optional(),
  startedAt: number(),
  answeredAt: number().optional(),
  endedAt: number().optional(),
  endReason: EndReasonSchema.optional(),
  transcript: array(TranscriptEntrySchema).default([]),
  processedEventIds: array(string()).default([]),
  metadata: record(string(), unknown()).optional(),
});
//#endregion
//#region extensions/voice-call/src/runtime-state.ts
const {
  setRuntime: setVoiceCallStateRuntime,
  clearRuntime: clearVoiceCallStateRuntime,
  tryGetRuntime: getOptionalVoiceCallStateRuntime,
} = createPluginRuntimeStore({
  pluginId: "voice-call-state",
  errorMessage: "Voice Call state runtime not initialized",
});
//#endregion
//#region extensions/voice-call/src/manager/store.ts
/** Plugin state namespace for call record event metadata. */
const CALL_RECORD_EVENTS_NAMESPACE = "call-record-events";
/** Plugin state namespace for base64 call record event chunks. */
const CALL_RECORD_EVENT_CHUNKS_NAMESPACE = "call-record-event-chunks";
/** Maximum retained call record events. */
const MAX_CALL_RECORD_EVENTS = 1e3;
/** Extra metadata entries retained so pruning can safely trim oldest rows. */
const CALL_RECORD_EVENT_META_MAX_ENTRIES = 1100;
const CALL_RECORD_CHUNK_MAX_ENTRIES = 48048;
/** Raw UTF-8 bytes stored per call record chunk before base64 encoding. */
const RAW_CALL_RECORD_CHUNK_BYTES = 47 * 1024;
let callRecordEventSequence = 0;
/** Return the pre-SQLite JSONL call log path for migration/compat checks. */
function resolveVoiceCallLegacyCallLogPath(storePath) {
  return path.join(storePath, "calls.jsonl");
}
/** Build env for plugin state stores rooted at the voice-call store path. */
function resolvePluginStateEnv(storePath) {
  return {
    ...process.env,
    OPENCLAW_STATE_DIR: storePath,
  };
}
/** Open the plugin state stores when the runtime is available. */
function createCallRecordStateStores(storePath) {
  const runtime = getOptionalVoiceCallStateRuntime();
  if (!runtime) return null;
  const env = resolvePluginStateEnv(storePath);
  return {
    events: runtime.state.openSyncKeyedStore({
      namespace: CALL_RECORD_EVENTS_NAMESPACE,
      maxEntries: CALL_RECORD_EVENT_META_MAX_ENTRIES,
      env,
    }),
    chunks: runtime.state.openSyncKeyedStore({
      namespace: CALL_RECORD_EVENT_CHUNKS_NAMESPACE,
      maxEntries: CALL_RECORD_CHUNK_MAX_ENTRIES,
      env,
    }),
  };
}
/** Open call stores and log failures instead of breaking restore paths. */
function tryCreateCallRecordStateStores(storePath) {
  try {
    return createCallRecordStateStores(storePath);
  } catch (err) {
    console.error("[voice-call] Failed to open SQLite call record store:", err);
    return null;
  }
}
/** Build the stable storage key for one chunk of an event. */
function buildChunkKey(eventKey, index) {
  return `${eventKey}:chunk:${String(index).padStart(4, "0")}`;
}
/** Build a deterministic key for one legacy JSONL line. */
function buildVoiceCallLegacyJsonlEventKey(line, index) {
  return `jsonl:${String(index).padStart(8, "0")}:${createHash("sha256").update(line).digest("hex")}`;
}
/** Allocate monotonic ordering metadata for newly persisted call records. */
function nextCallRecordOrder() {
  const sequence = callRecordEventSequence;
  callRecordEventSequence = (callRecordEventSequence + 1) % 1e6;
  return {
    persistedAt: Date.now(),
    sequence,
  };
}
/** Build a unique event key that preserves timestamp and sequence ordering. */
function buildNewEventKey(order) {
  return `event:${order.persistedAt.toString(36)}:${String(order.sequence).padStart(6, "0")}:${randomUUID()}`;
}
/** Recover the sequence segment from newer event keys. */
function parseEventKeySequence(key) {
  const sequence = /^event:[^:]+:(\d+):/.exec(key)?.[1];
  return sequence ? Number.parseInt(sequence, 10) : 0;
}
/** Parse a stored call record line from v2 envelope or legacy raw-call JSON. */
function parseVoiceCallRecordLine(line, sequence = 0) {
  if (!line.trim()) return null;
  try {
    const parsed = JSON.parse(line);
    if (parsed && typeof parsed === "object" && parsed.version === 2) {
      const envelope = parsed;
      return {
        call: CallRecordSchema.parse(envelope.call),
        persistedAt:
          typeof envelope.persistedAt === "number" && Number.isFinite(envelope.persistedAt)
            ? envelope.persistedAt
            : 0,
        sequence:
          typeof envelope.sequence === "number" && Number.isFinite(envelope.sequence)
            ? envelope.sequence
            : sequence,
        orderKey: "",
      };
    }
    return {
      call: CallRecordSchema.parse(parsed),
      persistedAt: 0,
      sequence,
      orderKey: "",
    };
  } catch {
    return null;
  }
}
/** Count storage chunks needed for a call record. */
function countCallRecordChunks(call) {
  return Math.max(
    1,
    Math.ceil(Buffer.byteLength(JSON.stringify(call), "utf8") / RAW_CALL_RECORD_CHUNK_BYTES),
  );
}
/** Truncate oversized call records to fit the bounded plugin state chunk budget. */
function prepareVoiceCallRecordForStorage(call) {
  if (countCallRecordChunks(call) <= 48) return call;
  const transcriptEntries = call.transcript.length;
  const metadata = {
    ...call.metadata,
    voiceCallPersistence: {
      transcriptTruncated: true,
      originalTranscriptEntries: transcriptEntries,
    },
  };
  const candidateInputs = [
    {
      transcript: call.transcript.slice(-20),
      metadata,
    },
    {
      transcript: [],
      metadata,
    },
    {
      transcript: [],
      metadata: {
        voiceCallPersistence: {
          transcriptTruncated: true,
          originalTranscriptEntries: transcriptEntries,
          metadataTruncated: true,
        },
      },
    },
  ];
  for (const candidateInput of candidateInputs) {
    const candidate = CallRecordSchema.parse({
      ...call,
      ...candidateInput,
    });
    if (countCallRecordChunks(candidate) <= 48) return candidate;
  }
  return call;
}
/** Register a serialized call record event and its chunks, then prune old events. */
function registerCallRecordEvent(stores, eventKey, call, order) {
  const serialized = JSON.stringify(prepareVoiceCallRecordForStorage(call));
  const buffer = Buffer.from(serialized, "utf8");
  const chunkCount = Math.max(1, Math.ceil(buffer.byteLength / RAW_CALL_RECORD_CHUNK_BYTES));
  if (chunkCount > 48)
    throw new Error(`voice-call record exceeds SQLite chunk limit (${chunkCount}/48)`);
  for (let index = 0; index < chunkCount; index += 1) {
    const chunk = buffer.subarray(
      index * RAW_CALL_RECORD_CHUNK_BYTES,
      (index + 1) * RAW_CALL_RECORD_CHUNK_BYTES,
    );
    stores.chunks.register(buildChunkKey(eventKey, index), {
      index,
      dataBase64: chunk.toString("base64"),
    });
  }
  stores.events.register(eventKey, {
    chunkCount,
    byteLength: buffer.byteLength,
    persistedAt: order?.persistedAt,
    sequence: order?.sequence,
  });
  pruneCallRecordEvents(stores);
}
/** Delete metadata and all chunk rows for one call record event. */
function deleteCallRecordEventRows(stores, eventKey) {
  const meta = stores.events.lookup(eventKey);
  stores.events.delete(eventKey);
  if (!meta) return;
  for (let index = 0; index < meta.chunkCount; index += 1)
    stores.chunks.delete(buildChunkKey(eventKey, index));
}
/** Keep only the newest bounded call record events. */
function pruneCallRecordEvents(stores) {
  const rows = stores.events.entries();
  if (rows.length <= 1e3) return;
  const sorted = rows.toSorted((a, b) => a.createdAt - b.createdAt || a.key.localeCompare(b.key));
  for (const row of sorted.slice(0, rows.length - MAX_CALL_RECORD_EVENTS))
    deleteCallRecordEventRows(stores, row.key);
}
/** Read and reassemble one chunked call record event. */
function readCallRecordEvent(stores, eventKey) {
  const meta = stores.events.lookup(eventKey);
  if (!meta) return null;
  const chunks = [];
  for (let index = 0; index < meta.chunkCount; index += 1) {
    const chunk = stores.chunks.lookup(buildChunkKey(eventKey, index));
    if (!chunk || chunk.index !== index) return null;
    chunks.push(Buffer.from(chunk.dataBase64, "base64"));
  }
  return (
    parseVoiceCallRecordLine(Buffer.concat(chunks, meta.byteLength).toString("utf8"))?.call ?? null
  );
}
/** Read all persisted call records in stable persisted order. */
function readCallRecordEvents(stores) {
  return stores.events
    .entries()
    .toSorted((a, b) => a.createdAt - b.createdAt || a.key.localeCompare(b.key))
    .map((entry) => {
      const call = readCallRecordEvent(stores, entry.key);
      return call
        ? {
            call,
            persistedAt: entry.value.persistedAt ?? entry.createdAt,
            sequence: entry.value.sequence ?? parseEventKeySequence(entry.key),
            orderKey: entry.key,
          }
        : null;
    })
    .filter((entry) => entry !== null)
    .toSorted(
      (a, b) =>
        a.persistedAt - b.persistedAt ||
        a.sequence - b.sequence ||
        a.orderKey.localeCompare(b.orderKey),
    )
    .map((entry) => entry.call);
}
/** Persist one call record event to plugin state. */
function persistCallRecord(storePath, call) {
  try {
    const stores = createCallRecordStateStores(storePath);
    if (!stores) throw new Error("Voice Call state runtime not initialized");
    const order = nextCallRecordOrder();
    registerCallRecordEvent(stores, buildNewEventKey(order), call, order);
  } catch (err) {
    console.error("[voice-call] Failed to persist call record:", err);
    throw err;
  }
}
/** Restore nonterminal active calls and provider/event indexes from persisted records. */
function loadActiveCallsFromStore(storePath) {
  const stores = tryCreateCallRecordStateStores(storePath);
  let calls = [];
  try {
    calls = stores ? readCallRecordEvents(stores) : [];
  } catch (err) {
    console.error("[voice-call] Failed to read SQLite call records:", err);
  }
  if (calls.length === 0)
    return {
      activeCalls: /* @__PURE__ */ new Map(),
      providerCallIdMap: /* @__PURE__ */ new Map(),
      processedEventIds: /* @__PURE__ */ new Set(),
      rejectedProviderCallIds: /* @__PURE__ */ new Set(),
    };
  const callMap = /* @__PURE__ */ new Map();
  for (const call of calls) callMap.set(call.callId, call);
  const activeCalls = /* @__PURE__ */ new Map();
  const providerCallIdMap = /* @__PURE__ */ new Map();
  const processedEventIds = /* @__PURE__ */ new Set();
  const rejectedProviderCallIds = /* @__PURE__ */ new Set();
  for (const [callId, call] of callMap) {
    for (const eventId of call.processedEventIds) processedEventIds.add(eventId);
    if (TerminalStates.has(call.state)) continue;
    activeCalls.set(callId, call);
    if (call.providerCallId) providerCallIdMap.set(call.providerCallId, callId);
  }
  return {
    activeCalls,
    providerCallIdMap,
    processedEventIds,
    rejectedProviderCallIds,
  };
}
function readCallHistoryFromStore(storePath) {
  const stores = tryCreateCallRecordStateStores(storePath);
  if (stores)
    try {
      return readCallRecordEvents(stores);
    } catch (err) {
      console.error("[voice-call] Failed to read SQLite call history:", err);
    }
  return [];
}
/** Find the newest retained snapshots matching each call identifier namespace. */
async function findCallMatchesInStore(storePath, callId) {
  const calls = readCallHistoryFromStore(storePath);
  return {
    byCallId: calls.findLast((call) => call.callId === callId),
    byProviderCallId: calls.findLast((call) => call.providerCallId === callId),
  };
}
/** Return the newest persisted call history rows up to the requested limit. */
async function getCallHistoryFromStore(storePath, limit = 50) {
  if (limit <= 0) return [];
  return readCallHistoryFromStore(storePath).slice(-limit);
}
//#endregion
export {
  MAX_CALL_RECORD_EVENTS as a,
  findCallMatchesInStore as c,
  parseVoiceCallRecordLine as d,
  persistCallRecord as f,
  TerminalStates as g,
  setVoiceCallStateRuntime as h,
  CALL_RECORD_EVENT_META_MAX_ENTRIES as i,
  getCallHistoryFromStore as l,
  resolveVoiceCallLegacyCallLogPath as m,
  CALL_RECORD_EVENTS_NAMESPACE as n,
  RAW_CALL_RECORD_CHUNK_BYTES as o,
  prepareVoiceCallRecordForStorage as p,
  CALL_RECORD_EVENT_CHUNKS_NAMESPACE as r,
  buildVoiceCallLegacyJsonlEventKey as s,
  CALL_RECORD_CHUNK_MAX_ENTRIES as t,
  loadActiveCallsFromStore as u,
};
