import { randomUUID } from "node:crypto";
import WebSocket$1, { WebSocketServer } from "ws";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  m as isFutureDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./text-utility-runtime-CJESZCN5.js";
import {
  A as buildRealtimeVoiceAgentConsultWorkingResponse,
  B as readRealtimeVoiceConsultQuestion,
  H as createTalkSessionController,
  L as createRealtimeVoiceForcedConsultCoordinator,
  T as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
  V as readSpeakableRealtimeVoiceToolResult,
  W as recordTalkObservabilityEvent,
  s as createRealtimeVoiceBridgeSession,
} from "./session-log-runtime-DVXN-XFR.js";
import "./realtime-voice-DQqBL-aH.js";
import "./webhook-ingress-BloIhSnv.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { t as normalizeWebhookPath } from "./webhook-path-CaYfbDPb.js";
import "node:http";
//#region extensions/voice-call/src/webhook/realtime-audio-pacer.ts
const TELEPHONY_SAMPLE_RATE = 8e3;
const TELEPHONY_CHUNK_BYTES = 160;
const TELEPHONY_CHUNK_MS = 20;
const DEFAULT_SPEECH_RMS_THRESHOLD = 0.035;
const DEFAULT_REQUIRED_LOUD_CHUNKS = 4;
const DEFAULT_REQUIRED_QUIET_CHUNKS = 12;
const DEFAULT_MAX_QUEUED_AUDIO_BYTES = TELEPHONY_SAMPLE_RATE * 120;
const PCM16_MAX_AMPLITUDE = 32768;
const MULAW_LINEAR_SAMPLES = /* @__PURE__ */ new Int16Array(256);
for (let i = 0; i < MULAW_LINEAR_SAMPLES.length; i += 1)
  MULAW_LINEAR_SAMPLES[i] = decodeMulawSample(i);
/** Paces outgoing mulaw audio frames at telephony cadence. */
var RealtimeAudioPacer = class {
  constructor(params) {
    this.params = params;
    this.queue = [];
    this.timer = null;
    this.queuedAudioBytes = 0;
    this.closed = false;
  }
  /** Queue mulaw audio and split it into 20ms-ish telephony chunks. */
  sendAudio(muLaw) {
    if (this.closed || muLaw.length === 0) return;
    const maxQueuedAudioBytes = this.params.maxQueuedAudioBytes ?? DEFAULT_MAX_QUEUED_AUDIO_BYTES;
    for (let offset = 0; offset < muLaw.length; offset += TELEPHONY_CHUNK_BYTES) {
      const chunk = Buffer.from(muLaw.subarray(offset, offset + TELEPHONY_CHUNK_BYTES));
      if (this.queuedAudioBytes + chunk.length > maxQueuedAudioBytes) {
        this.failBackpressure();
        return;
      }
      this.queue.push({
        type: "audio",
        chunk,
        durationMs: Math.max(1, Math.round((chunk.length / TELEPHONY_SAMPLE_RATE) * 1e3)),
      });
      this.queuedAudioBytes += chunk.length;
    }
    this.ensurePump();
  }
  /** Queue a provider mark frame after prior audio frames. */
  sendMark(name) {
    if (this.closed || !name) return;
    this.queue.push({
      type: "mark",
      name,
    });
    this.ensurePump();
  }
  /** Clear queued audio and notify the provider stream. */
  clearAudio() {
    if (this.closed) return 0;
    const clearedAudioBytes = this.queuedAudioBytes;
    this.clearTimer();
    this.queue = [];
    this.queuedAudioBytes = 0;
    this.params.send(this.params.serializer.clear());
    return clearedAudioBytes;
  }
  /** True while queued audio or a paced send timer can still reach the telephony stream. */
  hasPendingAudio() {
    return !this.closed && (this.queuedAudioBytes > 0 || this.timer !== null);
  }
  /** Stop sending and discard queued frames. */
  close() {
    this.closed = true;
    this.clearTimer();
    this.queue = [];
    this.queuedAudioBytes = 0;
  }
  /** Clear the scheduled pump timer. */
  clearTimer() {
    if (!this.timer) return;
    clearTimeout(this.timer);
    this.timer = null;
  }
  /** Start the pump when queued work exists and no timer is active. */
  ensurePump() {
    if (!this.timer) this.pump();
  }
  /** Close the pacer and notify the caller about queued-audio backpressure. */
  failBackpressure() {
    this.close();
    this.params.onBackpressure?.();
  }
  /** Send one queued item and schedule the next send based on audio duration. */
  pump() {
    this.timer = null;
    if (this.closed) return;
    const item = this.queue.shift();
    if (!item) return;
    let delayMs = 0;
    let sent;
    if (item.type === "audio") {
      this.queuedAudioBytes = Math.max(0, this.queuedAudioBytes - item.chunk.length);
      sent = this.params.send(this.params.serializer.media(item.chunk.toString("base64")));
      delayMs = item.durationMs || TELEPHONY_CHUNK_MS;
    } else sent = this.params.send(this.params.serializer.mark(item.name));
    if (!sent) {
      this.queue = [];
      this.queuedAudioBytes = 0;
      return;
    }
    if (this.queue.length > 0) this.timer = setTimeout(() => this.pump(), delayMs);
  }
};
/** Calculate normalized RMS from mulaw bytes. */
function calculateMulawRms(muLaw) {
  if (muLaw.length === 0) return 0;
  let sum = 0;
  for (const sample of muLaw) {
    const normalized = (MULAW_LINEAR_SAMPLES[sample] ?? 0) / PCM16_MAX_AMPLITUDE;
    sum += normalized * normalized;
  }
  return Math.sqrt(sum / muLaw.length);
}
/** Detect likely speech start from consecutive loud mulaw chunks. */
var RealtimeMulawSpeechStartDetector = class {
  constructor(params = {}) {
    this.params = params;
    this.loudChunks = 0;
    this.quietChunks = DEFAULT_REQUIRED_QUIET_CHUNKS;
    this.speaking = false;
  }
  /** Accept one mulaw chunk and return true only on transition into speaking. */
  accept(muLaw) {
    if (calculateMulawRms(muLaw) >= (this.params.rmsThreshold ?? DEFAULT_SPEECH_RMS_THRESHOLD)) {
      this.quietChunks = 0;
      this.loudChunks += 1;
      const requiredLoudChunks = this.params.requiredLoudChunks ?? DEFAULT_REQUIRED_LOUD_CHUNKS;
      if (!this.speaking && this.loudChunks >= requiredLoudChunks) {
        this.speaking = true;
        return true;
      }
      return false;
    }
    this.loudChunks = 0;
    this.quietChunks += 1;
    const requiredQuietChunks = this.params.requiredQuietChunks ?? DEFAULT_REQUIRED_QUIET_CHUNKS;
    if (this.quietChunks >= requiredQuietChunks) this.speaking = false;
    return false;
  }
};
/** Decode one G.711 mulaw byte to a linear PCM sample. */
function decodeMulawSample(value) {
  const muLaw = ~value & 255;
  const sign = muLaw & 128;
  const exponent = (muLaw >> 4) & 7;
  let sample = (((muLaw & 15) << 3) + 132) << exponent;
  sample -= 132;
  return sign ? -sample : sample;
}
//#endregion
//#region extensions/voice-call/src/webhook/stream-frame-adapter.ts
/** Parse numeric timestamps sent as numbers or integer strings. */
function parseTimestampMs(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^[+-]?\d+$/.test(value.trim())) {
    const parsed = Number(value.trim());
    return Number.isSafeInteger(parsed) ? parsed : void 0;
  }
}
/** Parse a JSON object frame, returning null for invalid or non-object payloads. */
function tryParseJson(rawMessage) {
  try {
    const parsed = JSON.parse(rawMessage);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {}
  return null;
}
/** Read an object-valued field from a parsed frame. */
function readRecordField(record, field) {
  const value = record[field];
  return typeof value === "object" && value !== null ? value : void 0;
}
/** Normalize base64/base64url padding differences for validation. */
function normalizeBase64ForCompare(value) {
  return value.replace(/=+$/u, "").replace(/-/gu, "+").replace(/_/gu, "/");
}
/** Return true when a payload round-trips as base64. */
function isValidBase64Payload(value) {
  return (
    normalizeBase64ForCompare(Buffer.from(value, "base64").toString("base64")) ===
    normalizeBase64ForCompare(value)
  );
}
/** Parse a common provider media frame. */
function parseMediaFrame(msg) {
  const mediaData = readRecordField(msg, "media");
  const payload = typeof mediaData?.payload === "string" ? mediaData.payload : void 0;
  if (!payload || !isValidBase64Payload(payload)) return { kind: "ignored" };
  return {
    kind: "media",
    payloadBase64: payload,
    timestampMs: parseTimestampMs(mediaData?.timestamp),
    track: typeof mediaData?.track === "string" ? mediaData.track : void 0,
  };
}
/** Parse a common provider mark frame. */
function parseMarkFrame(msg) {
  const markData = readRecordField(msg, "mark");
  return {
    kind: "mark",
    name: typeof markData?.name === "string" ? markData.name : void 0,
  };
}
/** Parse common media, mark, and stop frames shared by supported providers. */
function parseCommonInboundFrame(event, msg) {
  if (event === "media") return parseMediaFrame(msg);
  if (event === "mark") return parseMarkFrame(msg);
  if (event === "stop") return { kind: "stop" };
}
/** Parse one provider frame with provider-specific start/error hooks. */
function parseProviderInboundFrame(rawMessage, parseStartFrame, parseExtraFrame) {
  const msg = tryParseJson(rawMessage);
  if (!msg) return { kind: "ignored" };
  const event = msg.event;
  if (event === "start") return parseStartFrame(msg) ?? { kind: "ignored" };
  return (
    parseCommonInboundFrame(event, msg) ?? parseExtraFrame?.(event, msg) ?? { kind: "ignored" }
  );
}
/** Include streamSid only when Twilio has already supplied one. */
function withOptionalStreamSid(streamSid) {
  return streamSid === void 0 ? {} : { streamSid };
}
/** Serialize a provider media frame. */
function serializeMediaFrame(payloadBase64, streamSid) {
  return JSON.stringify({
    event: "media",
    ...withOptionalStreamSid(streamSid),
    media: { payload: payloadBase64 },
  });
}
/** Serialize a provider clear frame. */
function serializeClearFrame(streamSid) {
  return JSON.stringify({
    event: "clear",
    ...withOptionalStreamSid(streamSid),
  });
}
/** Serialize a provider mark frame. */
function serializeMarkFrame(name, streamSid) {
  return JSON.stringify({
    event: "mark",
    ...withOptionalStreamSid(streamSid),
    mark: { name },
  });
}
/** Twilio media stream adapter, retaining streamSid for outbound frames. */
var TwilioStreamFrameAdapter = class {
  constructor() {
    this.providerName = "twilio";
    this.streamSid = "";
  }
  /** Parse one Twilio websocket message into a normalized frame. */
  parseInbound(rawMessage) {
    return parseProviderInboundFrame(rawMessage, (msg) => {
      const startData = readRecordField(msg, "start");
      const streamSid = typeof startData?.streamSid === "string" ? startData.streamSid : "";
      const callSid = typeof startData?.callSid === "string" ? startData.callSid : "";
      if (!streamSid || !callSid) return;
      this.streamSid = streamSid;
      return {
        kind: "start",
        streamId: streamSid,
        providerCallId: callSid,
      };
    });
  }
  /** Serialize Twilio media with the active streamSid. */
  serializeMedia(payloadBase64) {
    return serializeMediaFrame(payloadBase64, this.streamSid);
  }
  /** Serialize Twilio clear with the active streamSid. */
  serializeClear() {
    return serializeClearFrame(this.streamSid);
  }
  /** Serialize Twilio mark with the active streamSid. */
  serializeMark(name) {
    return serializeMarkFrame(name, this.streamSid);
  }
};
/** Telnyx media stream adapter. */
var TelnyxStreamFrameAdapter = class {
  constructor() {
    this.providerName = "telnyx";
  }
  /** Parse one Telnyx websocket message into a normalized frame. */
  parseInbound(rawMessage) {
    return parseProviderInboundFrame(
      rawMessage,
      (msg) => {
        const topLevelStreamId =
          typeof msg.stream_id === "string" && msg.stream_id ? msg.stream_id : void 0;
        const startData = readRecordField(msg, "start");
        const providerCallId =
          typeof startData?.call_control_id === "string" && startData.call_control_id
            ? startData.call_control_id
            : void 0;
        if (!topLevelStreamId || !providerCallId) return;
        return {
          kind: "start",
          streamId: topLevelStreamId,
          providerCallId,
        };
      },
      (event, msg) => {
        if (event !== "error") return;
        const errorData = readRecordField(msg, "payload");
        return {
          kind: "error",
          code:
            typeof errorData?.code === "string" || typeof errorData?.code === "number"
              ? String(errorData.code)
              : void 0,
          title: typeof errorData?.title === "string" ? errorData.title : void 0,
          detail: typeof errorData?.detail === "string" ? errorData.detail : void 0,
        };
      },
    );
  }
  /** Serialize Telnyx media. */
  serializeMedia(payloadBase64) {
    return serializeMediaFrame(payloadBase64);
  }
  /** Serialize Telnyx clear. */
  serializeClear() {
    return serializeClearFrame();
  }
  /** Serialize Telnyx mark. */
  serializeMark(name) {
    return serializeMarkFrame(name);
  }
};
//#endregion
//#region extensions/voice-call/src/webhook/realtime-handler.ts
const STREAM_TOKEN_TTL_MS = 3e4;
const DEFAULT_HOST = "localhost:8443";
const MAX_REALTIME_MESSAGE_BYTES = 256 * 1024;
const MAX_REALTIME_WS_BUFFERED_BYTES = 1024 * 1024;
const FORCED_CONSULT_FALLBACK_DELAY_MS = 200;
const FORCED_CONSULT_NATIVE_DEDUPE_MS = 2e3;
const FORCED_CONSULT_RESULT_MAX_CHARS = 1800;
const FORCED_CONSULT_REASON = "provider_final_transcript_without_openclaw_agent_consult";
const CONSULT_TRANSCRIPT_SETTLE_MS = 350;
const CONSULT_TRANSCRIPT_SETTLE_MAX_MS = 1e3;
const MAX_PARTIAL_USER_TRANSCRIPT_CHARS = 1200;
const RECENT_FINAL_USER_TRANSCRIPT_TTL_MS = 2e3;
const BARGE_IN_REQUIRED_LOUD_CHUNKS = 2;
const logger = createSubsystemLogger("voice-call/realtime");
function buildGreetingInstructions(baseInstructions, greeting) {
  const trimmedGreeting = greeting?.trim();
  if (!trimmedGreeting) return;
  const intro =
    "Start the call by greeting the caller naturally. Include this greeting in your first spoken reply:";
  return baseInstructions
    ? `${baseInstructions}\n\n${intro} "${trimmedGreeting}"`
    : `${intro} "${trimmedGreeting}"`;
}
function readConsultArgText(args, key) {
  if (!args || typeof args !== "object" || Array.isArray(args)) return;
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readConsultQuestionText(args) {
  return readRealtimeVoiceConsultQuestion(args);
}
function normalizeTranscriptText(text) {
  return text.replace(/\s+/g, " ").trim();
}
function findTextOverlap(base, next) {
  const max = Math.min(base.length, next.length);
  for (let size = max; size > 0; size -= 1)
    if (base.slice(-size) === next.slice(0, size)) return size;
  return 0;
}
function shouldInsertTranscriptSpace(base, next) {
  if (!base || !next) return false;
  const last = base.at(-1);
  if (
    /\s$/.test(base) ||
    last === "(" ||
    last === "[" ||
    last === "{" ||
    last === '"' ||
    last === "'" ||
    /^[\s,.;:!?)]/.test(next)
  )
    return false;
  return true;
}
function appendTranscriptText(base, fragment) {
  const next = normalizeTranscriptText(fragment);
  if (!next) return base ?? "";
  const current = normalizeTranscriptText(base ?? "");
  if (!current) return next;
  const currentLower = current.toLowerCase();
  const nextLower = next.toLowerCase();
  if (currentLower === nextLower || currentLower.endsWith(nextLower)) return current;
  if (nextLower.startsWith(currentLower)) return next;
  const overlap = findTextOverlap(currentLower, nextLower);
  if (overlap >= 6 || (overlap >= 3 && next.length <= 12))
    return `${current}${next.slice(overlap)}`.trim();
  return `${current}${shouldInsertTranscriptSpace(current, next) ? " " : ""}${next}`.trim();
}
function resolveFinalTranscriptText(params) {
  const final = normalizeTranscriptText(params.final);
  const rawPartial = params.rawPartial ?? "";
  const partial = normalizeTranscriptText(params.partial ?? rawPartial);
  if (!partial) return final;
  if (!final) return partial;
  const compact = (value) => value.toLowerCase().replaceAll(/\s/g, "");
  const compactFinal = compact(final);
  const compactRaw = compact(rawPartial);
  const compactPartial = compact(partial);
  if (compactFinal.startsWith(compactPartial) || compactFinal.endsWith(compactPartial))
    return final;
  if (compactPartial.endsWith(compactFinal)) return partial;
  if (compactRaw !== compactPartial) return appendTranscriptText(partial, params.final);
  return normalizeTranscriptText(`${rawPartial}${params.final}`);
}
function limitPartialUserTranscript(text) {
  if (text.length <= MAX_PARTIAL_USER_TRANSCRIPT_CHARS) return text;
  const tail = sliceUtf16Safe(text, -1200);
  return tail.replace(/^\S+\s+/, "").trimStart() || tail.trimStart();
}
function withFallbackConsultQuestion(args, fallback) {
  const providerQuestion = readConsultQuestionText(args);
  const question = fallback?.trim();
  if (providerQuestion) {
    if (
      question &&
      providerQuestion.length <= 40 &&
      question.length >= providerQuestion.length + 8
    ) {
      const context = readConsultArgText(args, "context");
      const fallbackContext = `Realtime provider supplied a shorter consult question: ${providerQuestion}`;
      return args && typeof args === "object" && !Array.isArray(args)
        ? {
            ...args,
            question,
            context: context ? `${context}\n\n${fallbackContext}` : fallbackContext,
          }
        : {
            question,
            context: fallbackContext,
          };
    }
    return args;
  }
  if (!question) return args;
  return args && typeof args === "object" && !Array.isArray(args)
    ? {
        ...args,
        question,
      }
    : { question };
}
function buildForcedConsultSpeechPrompt(result) {
  const trimmed = result.trim();
  return [
    "Internal OpenClaw consult result is ready.",
    "Do not call tools for this internal result.",
    "Speak the following answer to the caller now, briefly and naturally:",
    trimmed.length <= FORCED_CONSULT_RESULT_MAX_CHARS
      ? trimmed
      : `${truncateUtf16Safe(trimmed, FORCED_CONSULT_RESULT_MAX_CHARS - 16).trimEnd()} [truncated]`,
  ].join("\n");
}
function appendRecentTalkEventMetadata(call, event) {
  if (!call) return;
  const metadata = call.metadata ?? {};
  const previous = Array.isArray(metadata.recentTalkEvents) ? metadata.recentTalkEvents : [];
  metadata.lastTalkEventAt = event.timestamp;
  metadata.lastTalkEventType = event.type;
  metadata.recentTalkEvents = [
    ...previous,
    {
      id: event.id,
      brain: event.brain,
      mode: event.mode,
      provider: event.provider,
      seq: event.seq,
      sessionId: event.sessionId,
      timestamp: event.timestamp,
      transport: event.transport,
      type: event.type,
      ...(event.turnId ? { turnId: event.turnId } : {}),
      ...(event.final !== void 0 ? { final: event.final } : {}),
    },
  ].slice(-12);
  call.metadata = metadata;
}
var RealtimeCallHandler = class {
  constructor(
    config,
    manager,
    provider,
    realtimeProvider,
    providerConfig,
    servePath,
    coreConfig,
    resolveInstructions,
  ) {
    this.config = config;
    this.manager = manager;
    this.provider = provider;
    this.realtimeProvider = realtimeProvider;
    this.providerConfig = providerConfig;
    this.servePath = servePath;
    this.coreConfig = coreConfig;
    this.resolveInstructions = resolveInstructions;
    this.toolHandlers = /* @__PURE__ */ new Map();
    this.pendingStreamTokens = /* @__PURE__ */ new Map();
    this.activeBridgesByCallId = /* @__PURE__ */ new Map();
    this.activeTelephonyClosersByCallId = /* @__PURE__ */ new Map();
    this.partialUserTranscriptsByCallId = /* @__PURE__ */ new Map();
    this.rawPartialUserTranscriptsByCallId = /* @__PURE__ */ new Map();
    this.partialUserTranscriptUpdatedAtByCallId = /* @__PURE__ */ new Map();
    this.recentFinalUserTranscriptsByCallId = /* @__PURE__ */ new Map();
    this.recentFinalUserTranscriptTimersByCallId = /* @__PURE__ */ new Map();
    this.forcedConsultCoordinatorsByCallId = /* @__PURE__ */ new Map();
    this.forcedConsultsByCallId = /* @__PURE__ */ new Map();
    this.nativeConsultsInFlightByCallId = /* @__PURE__ */ new Map();
    this.publicOrigin = null;
    this.publicPathPrefix = "";
  }
  setPublicUrl(url) {
    try {
      const parsed = new URL(url);
      this.publicOrigin = parsed.host;
      const normalizedServePath = normalizeWebhookPath(this.servePath);
      const normalizedPublicPath = normalizeWebhookPath(parsed.pathname);
      const idx = normalizedPublicPath.indexOf(normalizedServePath);
      this.publicPathPrefix = idx > 0 ? normalizedPublicPath.slice(0, idx) : "";
    } catch {
      this.publicOrigin = null;
      this.publicPathPrefix = "";
    }
  }
  getStreamPathPattern() {
    return `${this.publicPathPrefix}${normalizeWebhookPath(this.config.streamPath ?? "/voice/stream/realtime")}`;
  }
  buildTwiMLPayload(req, params) {
    const rawDirection = params?.get("Direction");
    const previousOrigin = this.publicOrigin;
    if (!previousOrigin) this.publicOrigin = req.headers.host ?? DEFAULT_HOST;
    try {
      const { streamUrl } = this.issueStreamSession({
        providerName: "twilio",
        from: params?.get("From") ?? void 0,
        to: params?.get("To") ?? void 0,
        direction: rawDirection?.startsWith("outbound") ? "outbound" : "inbound",
      });
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/xml" },
        body: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}" />
  </Connect>
</Response>`,
      };
    } finally {
      this.publicOrigin = previousOrigin;
    }
  }
  handleWebSocketUpgrade(request, socket, head) {
    const token = new URL(request.url ?? "/", "wss://localhost").pathname.split("/").pop() ?? null;
    const callerMeta = token ? this.consumeStreamToken(token) : null;
    if (!callerMeta) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    const adapter =
      (callerMeta.providerName ?? "twilio") === "telnyx"
        ? new TelnyxStreamFrameAdapter()
        : new TwilioStreamFrameAdapter();
    new WebSocketServer({
      noServer: true,
      maxPayload: MAX_REALTIME_MESSAGE_BYTES,
    }).handleUpgrade(request, socket, head, (ws) => {
      let bridge = null;
      let initialized = false;
      let activeCallSid = "unknown";
      let stopReceived = false;
      let lastMediaTimestamp;
      let lastMediaGapWarnAt = 0;
      ws.on("message", (data) => {
        try {
          const frame = adapter.parseInbound(data.toString());
          if (frame.kind === "ignored") return;
          if (frame.kind === "start") {
            if (initialized) return;
            initialized = true;
            activeCallSid = frame.providerCallId;
            const nextBridge = this.handleCall(
              frame.streamId,
              frame.providerCallId,
              ws,
              callerMeta,
              adapter,
            );
            if (!nextBridge) return;
            bridge = nextBridge;
            return;
          }
          if (!bridge) return;
          if (frame.kind === "media") {
            const audio = Buffer.from(frame.payloadBase64, "base64");
            bridge.sendAudio(audio);
            if (frame.timestampMs !== void 0) {
              if (lastMediaTimestamp !== void 0) {
                const gapMs = frame.timestampMs - lastMediaTimestamp;
                const now = Date.now();
                if ((gapMs > 120 || gapMs < 0) && now - lastMediaGapWarnAt > 5e3) {
                  lastMediaGapWarnAt = now;
                  console.warn(
                    `[voice-call] realtime media timestamp gap providerCallId=${activeCallSid} gapMs=${gapMs} timestamp=${frame.timestampMs}`,
                  );
                }
              }
              lastMediaTimestamp = frame.timestampMs;
              bridge.setMediaTimestamp(frame.timestampMs);
            }
            return;
          }
          if (frame.kind === "mark") {
            bridge.acknowledgeMark();
            return;
          }
          if (frame.kind === "error") {
            console.error(
              `[voice-call] realtime WS error frame providerCallId=${activeCallSid} code=${frame.code ?? "?"} title=${frame.title ?? ""} detail=${frame.detail ?? ""}`,
            );
            return;
          }
          if (frame.kind === "stop") {
            stopReceived = true;
            this.closeTelephonyBridge(activeCallSid, bridge, "completed");
          }
        } catch (error) {
          console.error("[voice-call] realtime WS parse failed:", error);
        }
      });
      ws.on("close", (code) => {
        const reason = stopReceived || code === 1e3 || code === 1005 ? "completed" : "error";
        this.closeTelephonyBridge(activeCallSid, bridge, reason);
      });
      ws.on("error", (error) => {
        console.error("[voice-call] realtime WS error:", error);
      });
    });
  }
  registerToolHandler(name, fn) {
    this.toolHandlers.set(name, fn);
  }
  speak(callId, instructions) {
    const bridge = this.activeBridgesByCallId.get(callId);
    if (!bridge)
      return {
        success: false,
        error: "No active realtime bridge for call",
      };
    try {
      bridge.triggerGreeting(instructions);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: formatErrorMessage(error),
      };
    }
  }
  issueStreamSession(request = {}) {
    const token = this.issueStreamToken({
      providerName: request.providerName ?? "twilio",
      callId: request.callId,
      from: request.from,
      to: request.to,
      direction: request.direction,
    });
    return {
      token,
      streamUrl: `wss://${this.publicOrigin || DEFAULT_HOST}${this.getStreamPathPattern()}/${token}`,
    };
  }
  issueStreamToken(meta = {}) {
    const token = randomUUID();
    const now = Date.now();
    const expiry = resolveExpiresAtMsFromDurationMs(STREAM_TOKEN_TTL_MS, { nowMs: now });
    if (expiry !== void 0)
      this.pendingStreamTokens.set(token, {
        expiry,
        ...meta,
      });
    for (const [candidate, entry] of this.pendingStreamTokens)
      if (!isFutureDateTimestampMs(entry.expiry, { nowMs: now }))
        this.pendingStreamTokens.delete(candidate);
    return token;
  }
  consumeStreamToken(token) {
    const entry = this.pendingStreamTokens.get(token);
    if (!entry) return null;
    this.pendingStreamTokens.delete(token);
    if (!isFutureDateTimestampMs(entry.expiry)) return null;
    return {
      from: entry.from,
      to: entry.to,
      direction: entry.direction,
      providerName: entry.providerName,
      callId: entry.callId,
    };
  }
  handleCall(streamSid, callSid, ws, callerMeta, adapter) {
    const registration = this.registerCallInManager(callSid, callerMeta);
    if (!registration) {
      ws.close(1008, "Caller rejected by policy");
      return null;
    }
    const { callId, instructions, initialGreetingInstructions } = registration;
    const callRecord = this.manager.getCallByProviderCallId(callSid);
    const talk = createTalkSessionController(
      {
        sessionId: `voice-call:${callId}:realtime`,
        mode: "realtime",
        transport: "gateway-relay",
        brain: "agent-consult",
        provider: this.realtimeProvider.id,
      },
      { onEvent: recordTalkObservabilityEvent },
    );
    const rememberTalkEvent = (event) => {
      if (event) appendRecentTalkEventMetadata(callRecord, event);
      return event;
    };
    const emitTalkEvent = (input) => {
      return rememberTalkEvent(talk.emit(input));
    };
    const ensureTalkTurn = () => {
      const turn = talk.ensureTurn({
        payload: {
          callId,
          providerCallId: callSid,
        },
      });
      rememberTalkEvent(turn.event);
      return turn.turnId;
    };
    const endTalkTurn = (reason = "completed") => {
      const ended = talk.endTurn({
        payload: {
          callId,
          providerCallId: callSid,
          reason,
        },
      });
      if (ended.ok) rememberTalkEvent(ended.event);
    };
    const finishOutputAudio = (reason) => {
      rememberTalkEvent(
        talk.finishOutputAudio({
          payload: {
            callId,
            providerCallId: callSid,
            reason,
          },
        }),
      );
    };
    const providerHandlesInputAudioBargeIn =
      this.realtimeProvider.capabilities?.handlesInputAudioBargeIn === true;
    const cancelOutputAudioForBargeIn = (source, interruptProvider, clearedAudioBytes = 0) => {
      const outputAudioActive = talk.outputAudioActive;
      const pendingTelephonyAudio = audioPacer.hasPendingAudio();
      if (
        source === "provider" &&
        !outputAudioActive &&
        !pendingTelephonyAudio &&
        clearedAudioBytes === 0
      )
        return;
      const interruptedTurnId = talk.activeTurnId;
      interruptProvider?.(outputAudioActive || pendingTelephonyAudio);
      const clearedBytes =
        clearedAudioBytes +
        (source === "local" || pendingTelephonyAudio ? audioPacer.clearAudio() : 0);
      console.log(
        `[voice-call] realtime outbound audio cleared by ${source} barge-in callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`,
      );
      if (!outputAudioActive || !interruptedTurnId) return;
      const reason = `${source}-barge-in`;
      finishOutputAudio(reason);
      const cancelled = talk.cancelTurn({
        turnId: interruptedTurnId,
        payload: {
          callId,
          providerCallId: callSid,
          reason,
        },
      });
      if (cancelled.ok) rememberTalkEvent(cancelled.event);
    };
    emitTalkEvent({
      type: "session.started",
      payload: {
        callId,
        providerCallId: callSid,
        streamSid,
      },
    });
    console.log(
      `[voice-call] Realtime bridge starting for call ${callId} (providerCallId=${callSid}, initialGreeting=${initialGreetingInstructions ? "queued" : "absent"})`,
    );
    let callEndEmitted = false;
    const emitCallEnd = (reason) => {
      if (callEndEmitted) return;
      callEndEmitted = true;
      this.endCallInManager(callSid, callId, reason);
    };
    const sendString = (message) => {
      if (ws.readyState !== WebSocket$1.OPEN) return false;
      if (ws.bufferedAmount > MAX_REALTIME_WS_BUFFERED_BYTES) {
        console.warn(
          `[voice-call] realtime outbound websocket backpressure before send callId=${callId} providerCallId=${callSid} bufferedBytes=${ws.bufferedAmount}`,
        );
        ws.close(1013, "Backpressure: send buffer exceeded");
        return false;
      }
      ws.send(message);
      if (ws.bufferedAmount > MAX_REALTIME_WS_BUFFERED_BYTES) {
        console.warn(
          `[voice-call] realtime outbound websocket backpressure after send callId=${callId} providerCallId=${callSid} bufferedBytes=${ws.bufferedAmount}`,
        );
        ws.close(1013, "Backpressure: send buffer exceeded");
        return false;
      }
      return true;
    };
    const audioPacer = new RealtimeAudioPacer({
      send: sendString,
      serializer: {
        media: (payload) => adapter.serializeMedia(payload),
        clear: () => adapter.serializeClear(),
        mark: (name) => adapter.serializeMark(name),
      },
      onBackpressure: () => {
        console.warn(
          `[voice-call] realtime paced audio backpressure callId=${callId} providerCallId=${callSid}`,
        );
        if (ws.readyState === WebSocket$1.OPEN)
          ws.close(1013, "Backpressure: paced audio queue exceeded");
      },
    });
    const speechDetector = new RealtimeMulawSpeechStartDetector({
      requiredLoudChunks: BARGE_IN_REQUIRED_LOUD_CHUNKS,
    });
    const interruptResponseOnInputAudio =
      typeof this.providerConfig.interruptResponseOnInputAudio === "boolean"
        ? this.providerConfig.interruptResponseOnInputAudio
        : void 0;
    const session = createRealtimeVoiceBridgeSession({
      provider: this.realtimeProvider,
      cfg: this.coreConfig,
      providerConfig: this.providerConfig,
      interruptResponseOnInputAudio,
      instructions,
      tools: this.config.tools,
      initialGreetingInstructions,
      triggerGreetingOnReady: Boolean(initialGreetingInstructions),
      audioSink: {
        isOpen: () => ws.readyState === WebSocket$1.OPEN,
        sendAudio: (muLaw) => {
          const turnId = ensureTalkTurn();
          rememberTalkEvent(
            talk.startOutputAudio({
              turnId,
              payload: {
                callId,
                providerCallId: callSid,
              },
            }).event,
          );
          emitTalkEvent({
            type: "output.audio.delta",
            turnId,
            payload: { byteLength: muLaw.length },
          });
          audioPacer.sendAudio(muLaw);
        },
        clearAudio: (reason) => {
          const clearedBytes = audioPacer.clearAudio();
          if (reason === "barge-in") {
            cancelOutputAudioForBargeIn("provider", void 0, clearedBytes);
            return;
          }
          console.log(
            `[voice-call] realtime outbound audio clear requested callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`,
          );
          finishOutputAudio("clear");
        },
        sendMark: (markName) => {
          audioPacer.sendMark(markName);
        },
      },
      onTranscript: (role, text, isFinal) => {
        const turnId = ensureTalkTurn();
        emitTalkEvent({
          type:
            role === "assistant"
              ? isFinal
                ? "output.text.done"
                : "output.text.delta"
              : isFinal
                ? "transcript.done"
                : "transcript.delta",
          turnId,
          payload:
            role === "assistant"
              ? { text }
              : {
                  role,
                  text,
                },
          final: isFinal,
        });
        if (role === "user" && isFinal)
          emitTalkEvent({
            type: "input.audio.committed",
            turnId,
            payload: {
              callId,
              providerCallId: callSid,
            },
            final: true,
          });
        if (!isFinal) {
          if (role === "user" && text.trim()) {
            const transcript = this.recordPartialUserTranscript(callId, text);
            console.log(
              `[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=false chars=${text.trim().length} aggregateChars=${transcript.length}`,
            );
          }
          return;
        }
        if (role === "user") {
          const transcript = resolveFinalTranscriptText({
            partial: this.partialUserTranscriptsByCallId.get(callId),
            rawPartial: this.rawPartialUserTranscriptsByCallId.get(callId),
            final: text,
          });
          this.clearPartialUserTranscript(callId);
          this.setRecentFinalUserTranscript(callId, transcript);
          console.log(
            `[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=true chars=${text.trim().length} aggregateChars=${transcript.length}`,
          );
          const event = {
            id: `realtime-speech-${callSid}-${Date.now()}`,
            type: "call.speech",
            callId,
            providerCallId: callSid,
            timestamp: Date.now(),
            transcript,
            isFinal: true,
          };
          this.manager.processEvent(event);
          this.scheduleForcedAgentConsult({
            session,
            callId,
            callSid,
            transcript,
            clearAudio: () => {
              const clearedBytes = audioPacer.clearAudio();
              console.log(
                `[voice-call] realtime forced consult cleared outbound audio callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`,
              );
            },
          });
          return;
        }
        this.manager.processEvent({
          id: `realtime-bot-${callSid}-${Date.now()}`,
          type: "call.assistant-speech",
          callId,
          providerCallId: callSid,
          timestamp: Date.now(),
          transcript: text,
        });
      },
      onToolCall: (toolEvent, sessionLocal) => {
        const turnId = ensureTalkTurn();
        emitTalkEvent({
          type: "tool.call",
          turnId,
          itemId: toolEvent.itemId,
          callId: toolEvent.callId,
          payload: {
            name: toolEvent.name,
            args: toolEvent.args,
          },
        });
        console.log(
          `[voice-call] realtime tool call received callId=${callId} providerCallId=${callSid} tool=${toolEvent.name}`,
        );
        return this.executeToolCall(
          sessionLocal,
          callId,
          toolEvent.callId || toolEvent.itemId,
          toolEvent.name,
          toolEvent.args,
          turnId,
          emitTalkEvent,
        );
      },
      onEvent: (event) => {
        if (event.type === "input_audio_buffer.speech_started") {
          ensureTalkTurn();
          return;
        }
        if (event.type === "input_audio_buffer.speech_stopped") {
          const turnId = talk.activeTurnId;
          if (!turnId) return;
          emitTalkEvent({
            type: "input.audio.committed",
            turnId,
            payload: {
              callId,
              providerCallId: callSid,
              source: event.type,
            },
            final: true,
          });
          return;
        }
        if (event.type === "response.done") {
          finishOutputAudio("response.done");
          endTalkTurn("response.done");
          return;
        }
        if (event.type === "error")
          emitTalkEvent({
            type: "session.error",
            payload: { message: event.detail ?? "Realtime provider error" },
            final: true,
          });
      },
      onReady: () => {
        emitTalkEvent({
          type: "session.ready",
          payload: {
            callId,
            providerCallId: callSid,
          },
        });
      },
      onError: (error) => {
        console.error("[voice-call] realtime voice error:", error.message);
        emitTalkEvent({
          type: "session.error",
          payload: { message: error.message },
          final: true,
        });
      },
      onClose: (reason) => {
        this.activeBridgesByCallId.delete(callId);
        this.activeBridgesByCallId.delete(callSid);
        this.activeTelephonyClosersByCallId.delete(callId);
        this.activeTelephonyClosersByCallId.delete(callSid);
        this.clearUserTranscriptState(callId);
        finishOutputAudio(reason);
        emitTalkEvent({
          type: "session.closed",
          payload: { reason },
          final: true,
        });
        if (reason !== "error") return;
        emitCallEnd("error");
        if (ws.readyState === WebSocket$1.OPEN) ws.close(1011, "Bridge disconnected");
        this.provider
          .hangupCall({
            callId,
            providerCallId: callSid,
            reason: "error",
          })
          .catch((error) => {
            console.warn(
              `[voice-call] Failed to hang up realtime call ${callSid}: ${formatErrorMessage(error)}`,
            );
          });
      },
    });
    const closeTelephony = (reason) => {
      try {
        session.close();
      } finally {
        emitCallEnd(reason);
      }
    };
    this.activeBridgesByCallId.set(callId, session);
    this.activeBridgesByCallId.set(callSid, session);
    this.activeTelephonyClosersByCallId.set(callId, closeTelephony);
    this.activeTelephonyClosersByCallId.set(callSid, closeTelephony);
    const sendAudioToSession = session.sendAudio.bind(session);
    session.sendAudio = (audio) => {
      if (speechDetector.accept(audio)) {
        console.log(
          `[voice-call] realtime local speech detected callId=${callId} providerCallId=${callSid}`,
        );
        if (!providerHandlesInputAudioBargeIn)
          cancelOutputAudioForBargeIn("local", (audioPlaybackActive) => {
            session.handleBargeIn({ audioPlaybackActive });
          });
      }
      emitTalkEvent({
        type: "input.audio.delta",
        turnId: ensureTalkTurn(),
        payload: { byteLength: audio.length },
      });
      sendAudioToSession(audio);
    };
    const closeSession = session.close.bind(session);
    let sessionClosed = false;
    session.close = () => {
      if (sessionClosed) return;
      sessionClosed = true;
      try {
        closeSession();
      } finally {
        this.activeBridgesByCallId.delete(callId);
        this.activeBridgesByCallId.delete(callSid);
        this.activeTelephonyClosersByCallId.delete(callId);
        this.activeTelephonyClosersByCallId.delete(callSid);
        this.clearUserTranscriptState(callId);
        this.clearForcedConsultState(callId);
        audioPacer.close();
      }
    };
    session.connect().catch((error) => {
      console.error("[voice-call] Failed to connect realtime bridge:", error);
      session.close();
      emitCallEnd("error");
      ws.close(1011, "Failed to connect");
    });
    return session;
  }
  recordPartialUserTranscript(callId, text) {
    const next = limitPartialUserTranscript(
      appendTranscriptText(this.partialUserTranscriptsByCallId.get(callId), text),
    );
    const raw = limitPartialUserTranscript(
      `${this.rawPartialUserTranscriptsByCallId.get(callId) ?? ""}${text}`,
    );
    this.partialUserTranscriptsByCallId.set(callId, next);
    this.rawPartialUserTranscriptsByCallId.set(callId, raw);
    this.partialUserTranscriptUpdatedAtByCallId.set(callId, Date.now());
    return next;
  }
  clearPartialUserTranscript(callId) {
    this.partialUserTranscriptsByCallId.delete(callId);
    this.rawPartialUserTranscriptsByCallId.delete(callId);
    this.partialUserTranscriptUpdatedAtByCallId.delete(callId);
  }
  setRecentFinalUserTranscript(callId, text) {
    this.clearRecentFinalUserTranscript(callId);
    this.recentFinalUserTranscriptsByCallId.set(callId, text);
    const timer = setTimeout(() => {
      if (this.recentFinalUserTranscriptsByCallId.get(callId) === text)
        this.recentFinalUserTranscriptsByCallId.delete(callId);
      this.recentFinalUserTranscriptTimersByCallId.delete(callId);
    }, RECENT_FINAL_USER_TRANSCRIPT_TTL_MS);
    timer.unref?.();
    this.recentFinalUserTranscriptTimersByCallId.set(callId, timer);
  }
  clearRecentFinalUserTranscript(callId) {
    const timer = this.recentFinalUserTranscriptTimersByCallId.get(callId);
    if (timer) {
      clearTimeout(timer);
      this.recentFinalUserTranscriptTimersByCallId.delete(callId);
    }
    this.recentFinalUserTranscriptsByCallId.delete(callId);
  }
  clearUserTranscriptState(callId) {
    this.clearPartialUserTranscript(callId);
    this.clearRecentFinalUserTranscript(callId);
  }
  resolveUserTranscriptContext(callId) {
    return (
      this.partialUserTranscriptsByCallId.get(callId) ??
      this.recentFinalUserTranscriptsByCallId.get(callId)
    );
  }
  consumePartialUserTranscript(callId, consumed) {
    const text = consumed?.trim();
    if (!text) return;
    const current = this.partialUserTranscriptsByCallId.get(callId);
    if (!current) return;
    if (current === text) {
      this.clearPartialUserTranscript(callId);
      return;
    }
    if (current.toLowerCase().startsWith(text.toLowerCase())) {
      const remaining = current.slice(text.length).trimStart();
      if (remaining) {
        this.partialUserTranscriptsByCallId.set(callId, remaining);
        this.rawPartialUserTranscriptsByCallId.set(callId, remaining);
      } else this.clearPartialUserTranscript(callId);
    }
    const recent = this.recentFinalUserTranscriptsByCallId.get(callId);
    if (!recent) return;
    if (recent === text || recent.toLowerCase().startsWith(text.toLowerCase()))
      this.clearRecentFinalUserTranscript(callId);
  }
  async waitForConsultTranscriptSettle(callId, startedAt) {
    const deadline = startedAt + CONSULT_TRANSCRIPT_SETTLE_MAX_MS;
    while (true) {
      const updatedAt = this.partialUserTranscriptUpdatedAtByCallId.get(callId);
      if (!updatedAt) return;
      const now = Date.now();
      const quietFor = now - updatedAt;
      if (quietFor >= CONSULT_TRANSCRIPT_SETTLE_MS || now >= deadline) return;
      await new Promise((resolve) => {
        setTimeout(resolve, Math.min(CONSULT_TRANSCRIPT_SETTLE_MS - quietFor, deadline - now));
      });
    }
  }
  clearForcedConsultState(callId) {
    this.forcedConsultCoordinatorsByCallId.get(callId)?.clear();
    this.forcedConsultCoordinatorsByCallId.delete(callId);
    this.forcedConsultsByCallId.delete(callId);
  }
  forcedConsultCoordinator(callId) {
    const existing = this.forcedConsultCoordinatorsByCallId.get(callId);
    if (existing) return existing;
    const created = createRealtimeVoiceForcedConsultCoordinator();
    this.forcedConsultCoordinatorsByCallId.set(callId, created);
    return created;
  }
  closeTelephonyBridge(callIdOrSid, bridge, reason) {
    const closer = this.activeTelephonyClosersByCallId.get(callIdOrSid);
    if (closer) {
      closer(reason);
      return;
    }
    bridge?.close();
  }
  scheduleForcedAgentConsult(params) {
    if (this.config.consultPolicy !== "always") return;
    const question = params.transcript.trim();
    if (!question) return;
    const handler = this.toolHandlers.get(REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME);
    if (!handler) return;
    const existingForcedConsult = this.forcedConsultsByCallId.get(params.callId);
    if (existingForcedConsult && !existingForcedConsult.completedAt) return;
    const coordinator = this.forcedConsultCoordinator(params.callId);
    if (coordinator.hasRecentNativeConsult(question, { allowUnknownQuestion: true })) return;
    coordinator.clearPending();
    const pending = coordinator.prepare(question);
    if (!pending) return;
    coordinator.schedule(pending, FORCED_CONSULT_FALLBACK_DELAY_MS, (handle) => {
      const activeForcedConsult = this.forcedConsultsByCallId.get(params.callId);
      if (activeForcedConsult && !activeForcedConsult.completedAt) return;
      this.runForcedAgentConsult({
        ...params,
        handle,
        handler,
      });
    });
  }
  async runForcedAgentConsult(params) {
    const coordinator = this.forcedConsultCoordinator(params.callId);
    coordinator.markStarted(params.handle);
    const startedAt = Date.now();
    logger.debug(
      `[voice-call] realtime forced agent consult reason=${FORCED_CONSULT_REASON} consultPolicy=always callId=${params.callId} providerCallId=${params.callSid} chars=${params.handle.question.length}`,
    );
    console.log(
      `[voice-call] realtime forced agent consult starting callId=${params.callId} providerCallId=${params.callSid} chars=${params.handle.question.length}`,
    );
    params.clearAudio();
    const state = {
      sendSpeechPrompt: true,
      promise: Promise.resolve().then(() =>
        params.handler({ question: params.handle.question }, params.callId, {}),
      ),
    };
    this.forcedConsultsByCallId.set(params.callId, state);
    try {
      const result = await state.promise;
      state.completedAt = Date.now();
      coordinator.markDelivered(params.handle);
      const text = readSpeakableRealtimeVoiceToolResult(result, {
        keys: ["text", "output"],
        maxChars: FORCED_CONSULT_RESULT_MAX_CHARS,
      });
      if (!text) {
        console.warn(
          `[voice-call] realtime forced agent consult returned no speakable text callId=${params.callId} providerCallId=${params.callSid}`,
        );
        return;
      }
      if (state.sendSpeechPrompt) {
        params.clearAudio();
        params.session.sendUserMessage(buildForcedConsultSpeechPrompt(text));
      }
      console.log(
        `[voice-call] realtime forced agent consult completed callId=${params.callId} providerCallId=${params.callSid} elapsedMs=${Date.now() - startedAt}`,
      );
      this.consumePartialUserTranscript(params.callId, params.handle.question);
    } catch (error) {
      console.warn(
        `[voice-call] realtime forced agent consult failed callId=${params.callId} providerCallId=${params.callSid} error=${formatErrorMessage(error)}`,
      );
    } finally {
      setTimeout(() => {
        if (this.forcedConsultsByCallId.get(params.callId) === state) {
          this.forcedConsultsByCallId.delete(params.callId);
          coordinator.remove(params.handle);
        }
      }, FORCED_CONSULT_NATIVE_DEDUPE_MS).unref?.();
    }
  }
  registerCallInManager(callSid, callerMeta = {}) {
    const baseFields = {
      providerCallId: callSid,
      timestamp: Date.now(),
      direction: callerMeta.direction ?? "inbound",
      ...(callerMeta.from ? { from: callerMeta.from } : {}),
      ...(callerMeta.to ? { to: callerMeta.to } : {}),
    };
    const callRecord = this.resolveRealtimeCall(callSid, callerMeta, baseFields);
    if (!callRecord) return null;
    const initialGreeting = this.extractInitialGreeting(callRecord);
    console.log(
      `[voice-call] Realtime call ${callRecord.callId} initial greeting ${initialGreeting ? "queued" : "absent"}`,
    );
    if (callRecord.metadata) delete callRecord.metadata.initialMessage;
    this.manager.processEvent({
      id: `realtime-answered-${callSid}`,
      callId: callRecord.callId,
      type: "call.answered",
      ...baseFields,
    });
    const instructions = this.resolveInstructions?.(callRecord) ?? this.config.instructions;
    return {
      callId: callRecord.callId,
      instructions,
      initialGreetingInstructions: buildGreetingInstructions(instructions, initialGreeting),
    };
  }
  resolveRealtimeCall(callSid, callerMeta, baseFields) {
    if (callerMeta.callId) {
      const call = this.manager.getCall(callerMeta.callId);
      return call?.providerCallId === callSid ? call : null;
    }
    this.manager.processEvent({
      id: `realtime-initiated-${callSid}`,
      callId: callSid,
      type: "call.initiated",
      ...baseFields,
    });
    return this.manager.getCallByProviderCallId(callSid) ?? null;
  }
  extractInitialGreeting(call) {
    return typeof call.metadata?.initialMessage === "string"
      ? call.metadata.initialMessage
      : void 0;
  }
  endCallInManager(callSid, callId, reason) {
    this.manager.processEvent({
      id: `realtime-ended-${callSid}-${Date.now()}`,
      type: "call.ended",
      callId,
      providerCallId: callSid,
      timestamp: Date.now(),
      reason,
    });
  }
  async executeToolCall(bridge, callId, bridgeCallId, name, args, turnId, emitTalkEvent) {
    const handler = this.toolHandlers.get(name);
    const startedAt = Date.now();
    const hasResultError = (result) => {
      return Boolean(
        result && typeof result === "object" && !Array.isArray(result) && "error" in result,
      );
    };
    const emitFinalToolEvent = (result) => {
      emitTalkEvent?.({
        type: hasResultError(result) ? "tool.error" : "tool.result",
        turnId,
        callId: bridgeCallId,
        payload: {
          name,
          result,
        },
        final: true,
      });
    };
    const submitFinalToolResult = async (result) => {
      await bridge.submitToolResult(bridgeCallId, result);
      emitFinalToolEvent(result);
    };
    const submitWorkingResponse = async () => {
      if (
        handler &&
        name === "openclaw_agent_consult" &&
        bridge.bridge.supportsToolResultContinuation &&
        !this.config.fastContext.enabled
      ) {
        await bridge.submitToolResult(
          bridgeCallId,
          buildRealtimeVoiceAgentConsultWorkingResponse("caller"),
          { willContinue: true },
        );
        emitTalkEvent?.({
          type: "tool.progress",
          turnId,
          callId: bridgeCallId,
          payload: {
            name,
            status: "working",
          },
        });
      }
    };
    if (name === "openclaw_agent_consult") {
      const coordinator = this.forcedConsultCoordinator(callId);
      const forcedMatch = coordinator.recordNativeConsult(args, bridgeCallId);
      if (forcedMatch.kind === "none") {
        const pending = coordinator.consumePending();
        if (pending) coordinator.remove(pending);
      }
      const forcedConsult = this.forcedConsultsByCallId.get(callId);
      if (forcedMatch.kind === "already_delivered" && coordinator.isCancelled(forcedMatch.handle)) {
        if (forcedConsult) forcedConsult.sendSpeechPrompt = false;
        await submitFinalToolResult({
          status: "cancelled",
          message: "OpenClaw cancelled this consult before completion. Do not restart it.",
        });
        return;
      }
      if (forcedConsult) {
        if (forcedConsult.completedAt || forcedMatch.kind === "already_delivered") {
          await submitFinalToolResult({
            status: "already_delivered",
            message: "OpenClaw already delivered this consult result internally. Do not repeat it.",
          });
          return;
        }
        forcedConsult.sendSpeechPrompt = false;
        await submitFinalToolResult(
          await forcedConsult.promise.catch((error) => ({ error: formatErrorMessage(error) })),
        );
        return;
      }
      const existingNativeConsult = this.nativeConsultsInFlightByCallId.get(callId);
      if (existingNativeConsult) {
        console.log(
          `[voice-call] realtime tool call sharing in-flight agent consult callId=${callId} ageMs=${Date.now() - existingNativeConsult.startedAt}`,
        );
        await submitWorkingResponse();
        await submitFinalToolResult(await existingNativeConsult.promise);
        return;
      }
      const state = {
        startedAt,
        promise: Promise.resolve(),
      };
      state.promise = submitWorkingResponse().then(async () => {
        try {
          await this.waitForConsultTranscriptSettle(callId, startedAt);
          const context = { partialUserTranscript: this.resolveUserTranscriptContext(callId) };
          state.partialUserTranscript = context.partialUserTranscript;
          const handlerArgs = withFallbackConsultQuestion(args, context.partialUserTranscript);
          console.log(
            `[voice-call] realtime tool call executing callId=${callId} tool=${name} hasHandler=${Boolean(handler)}`,
          );
          return !handler
            ? { error: `Tool "${name}" not available` }
            : await handler(handlerArgs, callId, context);
        } catch (error) {
          return { error: formatErrorMessage(error) };
        }
      });
      this.nativeConsultsInFlightByCallId.set(callId, state);
      try {
        const result = await state.promise;
        const status =
          result && typeof result === "object" && !Array.isArray(result) && "error" in result
            ? "error"
            : "ok";
        const error =
          status === "error" && result && typeof result === "object" && !Array.isArray(result)
            ? formatErrorMessage(result.error ?? "unknown")
            : void 0;
        console.log(
          `[voice-call] realtime tool call completed callId=${callId} tool=${name} status=${status} elapsedMs=${Date.now() - startedAt}${error ? ` error=${error}` : ""}`,
        );
        await submitFinalToolResult(result);
        if (status === "ok") this.consumePartialUserTranscript(callId, state.partialUserTranscript);
      } finally {
        if (this.nativeConsultsInFlightByCallId.get(callId) === state)
          this.nativeConsultsInFlightByCallId.delete(callId);
      }
      return;
    }
    console.log(
      `[voice-call] realtime tool call executing callId=${callId} tool=${name} hasHandler=${Boolean(handler)}`,
    );
    const context = { partialUserTranscript: this.resolveUserTranscriptContext(callId) };
    const handlerArgs =
      name === "openclaw_agent_consult"
        ? withFallbackConsultQuestion(args, context.partialUserTranscript)
        : args;
    const result = !handler
      ? { error: `Tool "${name}" not available` }
      : await handler(handlerArgs, callId, context).catch((error) => ({
          error: formatErrorMessage(error),
        }));
    const status =
      result && typeof result === "object" && !Array.isArray(result) && "error" in result
        ? "error"
        : "ok";
    const error =
      status === "error" && result && typeof result === "object" && !Array.isArray(result)
        ? formatErrorMessage(result.error ?? "unknown")
        : void 0;
    console.log(
      `[voice-call] realtime tool call completed callId=${callId} tool=${name} status=${status} elapsedMs=${Date.now() - startedAt}${error ? ` error=${error}` : ""}`,
    );
    await submitFinalToolResult(result);
    if (name === "openclaw_agent_consult" && status === "ok")
      this.consumePartialUserTranscript(callId, context.partialUserTranscript);
  }
};
//#endregion
export { RealtimeCallHandler };
