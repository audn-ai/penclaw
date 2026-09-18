import { randomUUID } from "node:crypto";
import {
  ActivityHandling,
  Behavior,
  EndSensitivity,
  FunctionResponseScheduling,
  Modality,
  StartSensitivity,
  TurnCoverage,
} from "@google/genai";
import { t as asBoolean } from "../../boolean-CrriykWV.js";
import { s as warn } from "../../globals-CNUzHTcU.js";
import { t as createGoogleGenAI } from "../../google-genai-runtime-C9XtmKfE.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  P as timestampMsToIsoString,
  s as asFiniteNumber,
} from "../../number-coercion-CJQ8TR--.js";
import "../../number-runtime-B-n-wjMn.js";
import "../../runtime-env-D0V-7Gqz.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import "../../secret-input-D1aG0n6v.js";
import { S as resolveGoogleGemini3ThinkingLevel } from "../../provider-stream-shared-CMy-5I0G.js";
import {
  i as resamplePcm,
  n as mulawToPcm,
  t as convertPcmToMulaw8k,
} from "../../realtime-voice-DQqBL-aH.js";
import "../../thinking-Nrt0apsG.js";
import {
  Q as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
  T as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
  Z as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
} from "../../session-log-runtime-DVXN-XFR.js";
import { c as normalizeOptionalString } from "../../string-coerce-DW4mBlAt.js";
import { f as normalizeResolvedSecretInputString } from "../../types.secrets-BV0ywRAy.js";
//#region extensions/google/realtime-voice-provider.ts
const GOOGLE_REALTIME_DEFAULT_MODEL = "gemini-3.1-flash-live-preview";
const GOOGLE_REALTIME_DEFAULT_VOICE = "Kore";
const GOOGLE_REALTIME_DEFAULT_API_VERSION = "v1beta";
const GOOGLE_REALTIME_INPUT_SAMPLE_RATE = 16e3;
const GOOGLE_REALTIME_BROWSER_API_VERSION = "v1alpha";
const GOOGLE_REALTIME_BROWSER_WEBSOCKET_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";
const MAX_PENDING_AUDIO_CHUNKS = 320;
const DEFAULT_AUDIO_STREAM_END_SILENCE_MS = 500;
const GOOGLE_REALTIME_BROWSER_SESSION_TTL_MS = 1800 * 1e3;
const GOOGLE_REALTIME_BROWSER_NEW_SESSION_TTL_MS = 60 * 1e3;
const GOOGLE_REALTIME_RECONNECT_MAX_ATTEMPTS = 3;
const GOOGLE_REALTIME_RECONNECT_BASE_DELAY_MS = 250;
const GOOGLE_REALTIME_RECONNECT_MAX_DELAY_MS = 2e3;
const GOOGLE_REALTIME_TOOL_NAME_RE = /^[A-Za-z_][A-Za-z0-9_.:-]{0,127}$/;
const MULAW_LINEAR_SAMPLES = /* @__PURE__ */ new Int16Array(256);
for (let i = 0; i < MULAW_LINEAR_SAMPLES.length; i += 1)
  MULAW_LINEAR_SAMPLES[i] = decodeMulawSample(i);
const START_SENSITIVITY = {
  high: StartSensitivity.START_SENSITIVITY_HIGH,
  low: StartSensitivity.START_SENSITIVITY_LOW,
};
const END_SENSITIVITY = {
  high: EndSensitivity.END_SENSITIVITY_HIGH,
  low: EndSensitivity.END_SENSITIVITY_LOW,
};
const ACTIVITY_HANDLING = {
  "start-of-activity-interrupts": ActivityHandling.START_OF_ACTIVITY_INTERRUPTS,
  "no-interruption": ActivityHandling.NO_INTERRUPTION,
};
const TURN_COVERAGE = {
  "only-activity": TurnCoverage.TURN_INCLUDES_ONLY_ACTIVITY,
  "all-input": TurnCoverage.TURN_INCLUDES_ALL_INPUT,
  "audio-activity-and-all-video": TurnCoverage.TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO,
};
function trimToUndefined(value) {
  return normalizeOptionalString(value);
}
function asSensitivity(value) {
  const normalized = normalizeOptionalString(value)?.toLowerCase();
  return normalized === "low" || normalized === "high" ? normalized : void 0;
}
function asThinkingLevel(value) {
  const normalized = normalizeOptionalString(value)?.toLowerCase();
  return normalized === "minimal" ||
    normalized === "low" ||
    normalized === "medium" ||
    normalized === "high"
    ? normalized
    : void 0;
}
function asActivityHandling(value) {
  switch (normalizeOptionalString(value)?.toLowerCase().replaceAll("_", "-")) {
    case "start-of-activity-interrupts":
    case "start-of-activity-interrupt":
    case "interrupt":
    case "interrupts":
      return "start-of-activity-interrupts";
    case "no-interruption":
    case "no-interruptions":
    case "none":
      return "no-interruption";
    default:
      return;
  }
}
function asTurnCoverage(value) {
  switch (normalizeOptionalString(value)?.toLowerCase().replaceAll("_", "-")) {
    case "only-activity":
    case "turn-includes-only-activity":
      return "only-activity";
    case "all-input":
    case "turn-includes-all-input":
      return "all-input";
    case "audio-activity-and-all-video":
    case "turn-includes-audio-activity-and-all-video":
      return "audio-activity-and-all-video";
    default:
      return;
  }
}
function asNonNegativeInteger(value) {
  const number = asFiniteNumber(value);
  return number !== void 0 && Number.isSafeInteger(number) && number >= 0 ? number : void 0;
}
function asGoogleRealtimeThinkingBudget(value) {
  const budget = asFiniteNumber(value);
  return budget !== void 0 &&
    Number.isSafeInteger(budget) &&
    (budget === -1 || (budget >= 0 && budget <= 24576))
    ? budget
    : void 0;
}
function resolveGoogleRealtimeProviderConfigRecord(config) {
  const nested = (
    typeof config.providers === "object" &&
    config.providers !== null &&
    !Array.isArray(config.providers)
      ? config.providers
      : void 0
  )?.google;
  return typeof nested === "object" && nested !== null && !Array.isArray(nested)
    ? nested
    : typeof config.google === "object" && config.google !== null && !Array.isArray(config.google)
      ? config.google
      : config;
}
function normalizeProviderConfig(config, cfg) {
  const raw = resolveGoogleRealtimeProviderConfigRecord(config);
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw?.apiKey ?? cfg?.models?.providers?.google?.apiKey,
      path: "plugins.entries.voice-call.config.realtime.providers.google.apiKey",
    }),
    model: trimToUndefined(raw?.model),
    voice: trimToUndefined(raw?.speakerVoice) ?? trimToUndefined(raw?.voice),
    temperature: asFiniteNumber(raw?.temperature),
    apiVersion: trimToUndefined(raw?.apiVersion),
    prefixPaddingMs: asNonNegativeInteger(raw?.prefixPaddingMs),
    silenceDurationMs: asNonNegativeInteger(raw?.silenceDurationMs),
    startSensitivity: asSensitivity(raw?.startSensitivity),
    endSensitivity: asSensitivity(raw?.endSensitivity),
    activityHandling: asActivityHandling(raw?.activityHandling),
    turnCoverage: asTurnCoverage(raw?.turnCoverage),
    automaticActivityDetectionDisabled: asBoolean(raw?.automaticActivityDetectionDisabled),
    enableAffectiveDialog: asBoolean(raw?.enableAffectiveDialog),
    sessionResumption: asBoolean(raw?.sessionResumption),
    contextWindowCompression: asBoolean(raw?.contextWindowCompression),
    thinkingLevel: asThinkingLevel(raw?.thinkingLevel),
    thinkingBudget: asGoogleRealtimeThinkingBudget(raw?.thinkingBudget),
  };
}
function resolveEnvApiKey() {
  return trimToUndefined(process.env.GEMINI_API_KEY) ?? trimToUndefined(process.env.GOOGLE_API_KEY);
}
function isGemini31LiveModel(model) {
  const modelId = model.startsWith("models/") ? model.slice(7) : model;
  return modelId.startsWith("gemini-3.1-") && modelId.includes("-live");
}
function supportsAsyncFunctionCalling(model) {
  return !isGemini31LiveModel(model);
}
function buildThinkingConfig(config, model) {
  if (isGemini31LiveModel(model)) {
    const thinkingLevel = resolveGoogleGemini3ThinkingLevel({
      modelId: model,
      thinkingLevel: config.thinkingLevel,
      thinkingBudget: config.thinkingBudget,
    });
    return thinkingLevel ? { thinkingLevel } : void 0;
  }
  if (typeof config.thinkingBudget === "number") return { thinkingBudget: config.thinkingBudget };
}
function buildRealtimeInputConfig(config) {
  const startSensitivity = config.startSensitivity
    ? START_SENSITIVITY[config.startSensitivity]
    : void 0;
  const endSensitivity = config.endSensitivity ? END_SENSITIVITY[config.endSensitivity] : void 0;
  const activityHandling = config.activityHandling
    ? ACTIVITY_HANDLING[config.activityHandling]
    : void 0;
  const turnCoverage = config.turnCoverage ? TURN_COVERAGE[config.turnCoverage] : void 0;
  const automaticActivityDetection = {
    ...(typeof config.automaticActivityDetectionDisabled === "boolean"
      ? { disabled: config.automaticActivityDetectionDisabled }
      : {}),
    ...(startSensitivity ? { startOfSpeechSensitivity: startSensitivity } : {}),
    ...(endSensitivity ? { endOfSpeechSensitivity: endSensitivity } : {}),
    ...(typeof config.prefixPaddingMs === "number"
      ? { prefixPaddingMs: config.prefixPaddingMs }
      : {}),
    ...(typeof config.silenceDurationMs === "number"
      ? { silenceDurationMs: config.silenceDurationMs }
      : {}),
  };
  const realtimeInputConfig = {
    ...(Object.keys(automaticActivityDetection).length > 0 ? { automaticActivityDetection } : {}),
    ...(activityHandling ? { activityHandling } : {}),
    ...(turnCoverage ? { turnCoverage } : {}),
  };
  return Object.keys(realtimeInputConfig).length > 0 ? realtimeInputConfig : void 0;
}
function buildFunctionDeclarations(tools, allowNonBlocking) {
  const declarations = [];
  let omitted = 0;
  for (const tool of tools ?? [])
    try {
      const name = tool.name;
      if (typeof name !== "string" || !GOOGLE_REALTIME_TOOL_NAME_RE.test(name)) {
        omitted += 1;
        continue;
      }
      const declaration = {
        name,
        description: tool.description,
        parameters: tool.parameters,
      };
      if (allowNonBlocking && name === "openclaw_agent_consult")
        declaration.behavior = Behavior.NON_BLOCKING;
      declarations.push(declaration);
    } catch {
      omitted += 1;
    }
  if (omitted > 0)
    warn(`google realtime: omitted ${omitted} tool definition(s) with unsupported names`);
  return declarations;
}
function buildGoogleLiveConnectConfig(config, model) {
  const functionDeclarations = buildFunctionDeclarations(
    config.tools,
    supportsAsyncFunctionCalling(model),
  );
  const realtimeInputConfig = buildRealtimeInputConfig(config);
  const thinkingConfig = buildThinkingConfig(config, model);
  return {
    responseModalities: [Modality.AUDIO],
    ...(typeof config.temperature === "number" && config.temperature > 0
      ? { temperature: config.temperature }
      : {}),
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: config.voice ?? GOOGLE_REALTIME_DEFAULT_VOICE },
      },
    },
    systemInstruction: config.instructions,
    ...(functionDeclarations.length > 0 ? { tools: [{ functionDeclarations }] } : {}),
    ...(realtimeInputConfig ? { realtimeInputConfig } : {}),
    inputAudioTranscription: {},
    outputAudioTranscription: {},
    ...(!isGemini31LiveModel(model) && typeof config.enableAffectiveDialog === "boolean"
      ? { enableAffectiveDialog: config.enableAffectiveDialog }
      : {}),
    ...(thinkingConfig ? { thinkingConfig } : {}),
  };
}
function toGoogleModelResource(model) {
  return model.startsWith("models/") ? model : `models/${model}`;
}
function buildBrowserInitialSetup(model) {
  return {
    setup: {
      model: toGoogleModelResource(model),
      generationConfig: { responseModalities: [Modality.AUDIO] },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  };
}
function parsePcmSampleRate(mimeType) {
  const match = mimeType?.match(/(?:^|[;,\s])rate=(\d+)/i);
  const parsed = match ? Number.parseInt(match[1] ?? "", 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 24e3;
}
function isMulawSilence(audio) {
  return audio.length > 0 && audio.every((sample) => sample === 255);
}
function isPcm16Silence(audio) {
  const samples = Math.floor(audio.length / 2);
  if (samples === 0) return false;
  for (let i = 0; i < samples; i += 1) if (audio.readInt16LE(i * 2) !== 0) return false;
  return true;
}
function formatGoogleLiveCloseEvent(event) {
  if (!event) return "code=unknown reason=unknown";
  return `code=${typeof event.code === "number" ? event.code : "unknown"} reason=${event.reason?.trim() || "none"}${typeof event.wasClean === "boolean" ? ` clean=${event.wasClean}` : ""}`;
}
var GoogleRealtimeVoiceBridge = class {
  constructor(config) {
    this.config = config;
    this.supportsToolResultSuppression = false;
    this.session = null;
    this.connected = false;
    this.sessionConfigured = false;
    this.intentionallyClosed = false;
    this.pendingAudio = [];
    this.sessionReadyFired = false;
    this.consecutiveSilenceMs = 0;
    this.audioStreamEnded = false;
    this.pendingFunctionNames = /* @__PURE__ */ new Map();
    this.reconnectAttempts = 0;
    this.hasConnectedSession = false;
    this.pendingTranscripts = {
      user: "",
      assistant: "",
    };
    this.audioFormat = config.audioFormat ?? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ;
    this.model = config.model ?? GOOGLE_REALTIME_DEFAULT_MODEL;
    this.supportsToolResultContinuation = supportsAsyncFunctionCalling(this.model);
  }
  async connect() {
    const canResumeSession =
      this.config.sessionResumption !== false && Boolean(this.resumptionHandle);
    if (this.hasConnectedSession && !canResumeSession) this.resetPendingTranscripts();
    this.intentionallyClosed = false;
    this.sessionConfigured = false;
    this.sessionReadyFired = false;
    this.consecutiveSilenceMs = 0;
    this.audioStreamEnded = false;
    this.pendingFunctionNames.clear();
    const ai = createGoogleGenAI({
      apiKey: this.config.apiKey,
      httpOptions: { apiVersion: this.config.apiVersion ?? GOOGLE_REALTIME_DEFAULT_API_VERSION },
    });
    this.session = await ai.live.connect({
      model: this.model,
      config: {
        ...buildGoogleLiveConnectConfig(this.config, this.model),
        ...(this.config.sessionResumption === false
          ? {}
          : { sessionResumption: this.resumptionHandle ? { handle: this.resumptionHandle } : {} }),
        ...(this.config.contextWindowCompression === false
          ? {}
          : { contextWindowCompression: { slidingWindow: {} } }),
      },
      callbacks: {
        onopen: () => {
          this.connected = true;
        },
        onmessage: (message) => {
          this.handleMessage(message);
        },
        onerror: (event) => {
          const error =
            event.error instanceof Error
              ? event.error
              : new Error(
                  typeof event.message === "string" ? event.message : "Google Live API error",
                );
          this.config.onError?.(error);
        },
        onclose: (event) => {
          this.connected = false;
          this.sessionConfigured = false;
          this.pendingFunctionNames.clear();
          this.session = null;
          if (this.intentionallyClosed) {
            this.config.onClose?.("completed");
            return;
          }
          const closeDetails = formatGoogleLiveCloseEvent(event);
          if (this.scheduleReconnect(closeDetails)) return;
          this.flushPendingTranscripts();
          this.config.onError?.(
            /* @__PURE__ */ new Error(
              `Google Live session closed after reconnect attempts: ${closeDetails}`,
            ),
          );
          this.config.onClose?.("error");
        },
      },
    });
    this.hasConnectedSession = true;
  }
  sendAudio(audio) {
    if (!this.session || !this.connected || !this.sessionConfigured) {
      if (this.pendingAudio.length < MAX_PENDING_AUDIO_CHUNKS) this.pendingAudio.push(audio);
      return;
    }
    const silent = this.isSilence(audio);
    if (silent && this.audioStreamEnded) return;
    if (!silent) {
      this.consecutiveSilenceMs = 0;
      this.audioStreamEnded = false;
    }
    const pcm16k = this.toGoogleInputPcm16k(audio);
    this.session.sendRealtimeInput({
      audio: {
        data: pcm16k.toString("base64"),
        mimeType: `audio/pcm;rate=${GOOGLE_REALTIME_INPUT_SAMPLE_RATE}`,
      },
    });
    if (!silent) return;
    const silenceThresholdMs =
      typeof this.config.silenceDurationMs === "number"
        ? Math.max(0, Math.floor(this.config.silenceDurationMs))
        : DEFAULT_AUDIO_STREAM_END_SILENCE_MS;
    const bytesPerSample = this.audioFormat.encoding === "pcm16" ? 2 : 1;
    this.consecutiveSilenceMs += Math.round(
      (audio.length / bytesPerSample / this.audioFormat.sampleRateHz) * 1e3,
    );
    if (!this.audioStreamEnded && this.consecutiveSilenceMs >= silenceThresholdMs) {
      this.session.sendRealtimeInput({ audioStreamEnd: true });
      this.audioStreamEnded = true;
    }
  }
  setMediaTimestamp(_ts) {}
  sendUserMessage(text) {
    const normalized = text.trim();
    if (!normalized || !this.session || !this.connected || !this.sessionConfigured) return;
    if (isGemini31LiveModel(this.model)) {
      this.session.sendRealtimeInput({ text: normalized });
      return;
    }
    this.session.sendClientContent({
      turns: [
        {
          role: "user",
          parts: [{ text: normalized }],
        },
      ],
      turnComplete: true,
    });
  }
  triggerGreeting(instructions) {
    const greetingPrompt =
      instructions?.trim() || "Start the call now. Greet the caller naturally and keep it brief.";
    this.sendUserMessage(greetingPrompt);
  }
  submitToolResult(callId, result, options) {
    if (!this.session) return;
    const name = this.pendingFunctionNames.get(callId);
    if (!name) {
      this.config.onError?.(
        /* @__PURE__ */ new Error(
          `Google Live function response is missing a matching function call for ${callId}`,
        ),
      );
      return;
    }
    try {
      const isConsultTool = name === REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME;
      if (options?.willContinue === true && !this.supportsToolResultContinuation) {
        this.config.onError?.(
          /* @__PURE__ */ new Error(
            `Google Live model ${this.model} does not support continuing tool responses`,
          ),
        );
        return;
      }
      const functionResponse = {
        id: callId,
        name,
        response:
          result && typeof result === "object" && !Array.isArray(result)
            ? result
            : { output: result },
      };
      if (isConsultTool && this.supportsToolResultContinuation) {
        functionResponse.scheduling = FunctionResponseScheduling.WHEN_IDLE;
        if (options?.willContinue === true) functionResponse.willContinue = true;
      } else if (options?.willContinue === true) {
        this.config.onError?.(
          /* @__PURE__ */ new Error(
            `Google Live continuation is only supported for ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME}`,
          ),
        );
        return;
      }
      this.session.sendToolResponse({ functionResponses: [functionResponse] });
      if (options?.willContinue !== true) this.pendingFunctionNames.delete(callId);
    } catch (error) {
      this.config.onError?.(
        error instanceof Error
          ? error
          : /* @__PURE__ */ new Error("Failed to send Google Live function response"),
      );
    }
  }
  acknowledgeMark(_markName) {}
  close() {
    this.intentionallyClosed = true;
    this.connected = false;
    this.sessionConfigured = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = void 0;
    }
    this.pendingAudio = [];
    this.consecutiveSilenceMs = 0;
    this.audioStreamEnded = false;
    this.pendingFunctionNames.clear();
    this.flushPendingTranscripts();
    const session = this.session;
    this.session = null;
    session?.close();
  }
  isConnected() {
    return this.connected && this.sessionConfigured;
  }
  isSilence(audio) {
    return this.audioFormat.encoding === "pcm16" ? isPcm16Silence(audio) : isMulawSilence(audio);
  }
  toInputPcm(audio) {
    return this.audioFormat.encoding === "pcm16" ? audio : mulawToPcm(audio);
  }
  toGoogleInputPcm16k(audio) {
    if (this.audioFormat.encoding === "g711_ulaw" && this.audioFormat.sampleRateHz === 8e3 && true)
      return convertMulaw8kToPcm16k(audio);
    return resamplePcm(
      this.toInputPcm(audio),
      this.audioFormat.sampleRateHz,
      GOOGLE_REALTIME_INPUT_SAMPLE_RATE,
    );
  }
  toOutputAudio(pcm, sampleRate) {
    return this.audioFormat.encoding === "pcm16"
      ? resamplePcm(pcm, sampleRate, this.audioFormat.sampleRateHz)
      : convertPcmToMulaw8k(pcm, sampleRate);
  }
  handleMessage(message) {
    this.captureSessionLifecycle(message);
    if (message.setupComplete) this.handleSetupComplete();
    if (message.serverContent) this.handleServerContent(message.serverContent);
    if (message.toolCall) this.handleToolCall(message.toolCall);
  }
  captureSessionLifecycle(message) {
    const raw = message;
    const update = raw.sessionResumptionUpdate;
    if (update?.resumable && update.newHandle) this.resumptionHandle = update.newHandle;
    if (raw.goAway?.timeLeft)
      this.config.onError?.(
        /* @__PURE__ */ new Error(`Google Live session goAway: ${raw.goAway.timeLeft}`),
      );
  }
  handleSetupComplete() {
    this.sessionConfigured = true;
    this.reconnectAttempts = 0;
    for (const chunk of this.pendingAudio.splice(0)) this.sendAudio(chunk);
    if (!this.sessionReadyFired) {
      this.sessionReadyFired = true;
      this.config.onReady?.();
    }
  }
  handleServerContent(content) {
    if (content.interrupted) this.config.onClearAudio("barge-in");
    if (content.inputTranscription) this.appendTranscript("user", content.inputTranscription);
    if (content.outputTranscription)
      this.appendTranscript("assistant", content.outputTranscription);
    for (const part of content.modelTurn?.parts ?? [])
      if (part.inlineData?.data) {
        const pcm = Buffer.from(part.inlineData.data, "base64");
        const sampleRate = parsePcmSampleRate(part.inlineData.mimeType);
        const audio = this.toOutputAudio(pcm, sampleRate);
        if (audio.length > 0) {
          this.config.onAudio(audio);
          this.config.onMark?.(`audio-${randomUUID()}`);
        }
        continue;
      }
  }
  appendTranscript(role, transcript) {
    const text = transcript.text;
    if (text) {
      this.pendingTranscripts[role] += text;
      this.emitTranscript(role, text, false);
    }
    if (transcript.finished) this.flushPendingTranscript(role);
  }
  flushPendingTranscript(role) {
    const completeText = this.pendingTranscripts[role].trim();
    this.pendingTranscripts[role] = "";
    if (completeText) this.emitTranscript(role, completeText, true);
  }
  emitTranscript(role, text, isFinal) {
    try {
      this.config.onTranscript?.(role, text, isFinal);
    } catch (error) {
      try {
        this.config.onError?.(
          error instanceof Error
            ? error
            : /* @__PURE__ */ new Error("Google Live transcript callback failed"),
        );
      } catch {}
    }
  }
  flushPendingTranscripts() {
    this.flushPendingTranscript("user");
    this.flushPendingTranscript("assistant");
  }
  resetPendingTranscripts() {
    this.pendingTranscripts.user = "";
    this.pendingTranscripts.assistant = "";
  }
  handleToolCall(toolCall) {
    for (const call of toolCall.functionCalls ?? []) {
      const name = call.name?.trim();
      if (!name) continue;
      const callId = call.id?.trim() || `google-live-${randomUUID()}`;
      this.pendingFunctionNames.set(callId, name);
      this.config.onToolCall?.({
        itemId: callId,
        callId,
        name,
        args: call.args ?? {},
      });
    }
  }
  scheduleReconnect(closeDetails) {
    if (this.reconnectAttempts >= GOOGLE_REALTIME_RECONNECT_MAX_ATTEMPTS) return false;
    const attempt = ++this.reconnectAttempts;
    const delayMs = Math.min(
      GOOGLE_REALTIME_RECONNECT_MAX_DELAY_MS,
      GOOGLE_REALTIME_RECONNECT_BASE_DELAY_MS * 2 ** (attempt - 1),
    );
    this.config.onError?.(
      /* @__PURE__ */ new Error(
        `Google Live session closed unexpectedly (${closeDetails}); reconnecting ${attempt}/${GOOGLE_REALTIME_RECONNECT_MAX_ATTEMPTS} in ${delayMs}ms`,
      ),
    );
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = void 0;
      if (this.intentionallyClosed) return;
      this.connect().catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        this.config.onError?.(error instanceof Error ? error : new Error(message));
        if (!this.scheduleReconnect(`connect failed: ${message}`)) {
          this.flushPendingTranscripts();
          this.config.onClose?.("error");
        }
      });
    }, delayMs);
    return true;
  }
};
function convertMulaw8kToPcm16k(muLaw) {
  if (muLaw.length === 0) return Buffer.alloc(0);
  const pcm = Buffer.alloc(muLaw.length * 4);
  for (let i = 0; i < muLaw.length; i += 1) {
    const current = MULAW_LINEAR_SAMPLES[muLaw[i] ?? 0] ?? 0;
    const next = MULAW_LINEAR_SAMPLES[muLaw[i + 1] ?? muLaw[i] ?? 0] ?? current;
    pcm.writeInt16LE(current, i * 4);
    pcm.writeInt16LE(Math.round((current + next) / 2), i * 4 + 2);
  }
  return pcm;
}
function decodeMulawSample(value) {
  const muLaw = ~value & 255;
  const sign = muLaw & 128;
  const exponent = (muLaw >> 4) & 7;
  let sample = (((muLaw & 15) << 3) + 132) << exponent;
  sample -= 132;
  return sign ? -sample : sample;
}
async function createGoogleRealtimeBrowserSession(req) {
  const providerConfig = normalizeProviderConfig(req.providerConfig);
  const prefixPaddingMs = asNonNegativeInteger(req.prefixPaddingMs);
  const silenceDurationMs = asNonNegativeInteger(req.silenceDurationMs);
  const config = {
    ...providerConfig,
    ...(prefixPaddingMs !== void 0 ? { prefixPaddingMs } : {}),
    ...(silenceDurationMs !== void 0 ? { silenceDurationMs } : {}),
  };
  const apiKey = config.apiKey || resolveEnvApiKey();
  if (!apiKey) throw new Error("Google Gemini API key missing");
  const model = req.model ?? config.model ?? GOOGLE_REALTIME_DEFAULT_MODEL;
  const voice = req.voice ?? config.voice ?? GOOGLE_REALTIME_DEFAULT_VOICE;
  const nowMs = Date.now();
  const expiresAtMs = resolveExpiresAtMsFromDurationMs(GOOGLE_REALTIME_BROWSER_SESSION_TTL_MS, {
    nowMs,
  });
  const newSessionExpiresAtMs = resolveExpiresAtMsFromDurationMs(
    GOOGLE_REALTIME_BROWSER_NEW_SESSION_TTL_MS,
    { nowMs },
  );
  const expireTime = timestampMsToIsoString(expiresAtMs);
  const newSessionExpireTime = timestampMsToIsoString(newSessionExpiresAtMs);
  if (expiresAtMs === void 0 || !expireTime || !newSessionExpireTime)
    throw new Error("Google realtime browser session expiry is outside the supported Date range");
  const clientSecret = (
    await createGoogleGenAI({
      apiKey,
      httpOptions: {
        apiVersion: GOOGLE_REALTIME_BROWSER_API_VERSION,
        timeout: 3e4,
      },
    }).authTokens.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: {
          model,
          config: buildGoogleLiveConnectConfig(
            {
              ...config,
              apiKey,
              model,
              voice,
              instructions: req.instructions,
              tools: req.tools,
            },
            model,
          ),
        },
      },
    })
  ).name?.trim();
  if (!clientSecret)
    throw new Error("Google Live browser session did not return an ephemeral token");
  return {
    provider: "google",
    transport: "provider-websocket",
    protocol: "google-live-bidi",
    clientSecret,
    websocketUrl: GOOGLE_REALTIME_BROWSER_WEBSOCKET_URL,
    audio: {
      inputEncoding: "pcm16",
      inputSampleRateHz: GOOGLE_REALTIME_INPUT_SAMPLE_RATE,
      outputEncoding: "pcm16",
      outputSampleRateHz: 24e3,
    },
    initialMessage: buildBrowserInitialSetup(model),
    model,
    voice,
    expiresAt: Math.floor(expiresAtMs / 1e3),
  };
}
function buildGoogleRealtimeVoiceProvider() {
  return {
    id: "google",
    label: "Google Live Voice",
    defaultModel: GOOGLE_REALTIME_DEFAULT_MODEL,
    autoSelectOrder: 20,
    capabilities: {
      transports: ["provider-websocket", "gateway-relay"],
      inputAudioFormats: [
        REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
        REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
      ],
      outputAudioFormats: [
        REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
        REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
      ],
      supportsBrowserSession: true,
      supportsBargeIn: true,
      handlesInputAudioBargeIn: true,
      supportsToolCalls: true,
      supportsVideoFrames: true,
      supportsSessionResumption: true,
    },
    resolveConfig: ({ cfg, rawConfig }) => normalizeProviderConfig(rawConfig, cfg),
    isConfigured: ({ providerConfig }) =>
      Boolean(normalizeProviderConfig(providerConfig).apiKey || resolveEnvApiKey()),
    createBridge: (req) => {
      const config = normalizeProviderConfig(req.providerConfig);
      const apiKey = config.apiKey || resolveEnvApiKey();
      if (!apiKey) throw new Error("Google Gemini API key missing");
      return new GoogleRealtimeVoiceBridge({
        ...req,
        apiKey,
        model: config.model,
        voice: config.voice,
        temperature: config.temperature,
        apiVersion: config.apiVersion,
        prefixPaddingMs: config.prefixPaddingMs,
        silenceDurationMs: config.silenceDurationMs,
        startSensitivity: config.startSensitivity,
        endSensitivity: config.endSensitivity,
        activityHandling: config.activityHandling,
        turnCoverage: config.turnCoverage,
        automaticActivityDetectionDisabled: config.automaticActivityDetectionDisabled,
        enableAffectiveDialog: config.enableAffectiveDialog,
        sessionResumption: config.sessionResumption,
        contextWindowCompression: config.contextWindowCompression,
        thinkingLevel: config.thinkingLevel,
        thinkingBudget: config.thinkingBudget,
      });
    },
    createBrowserSession: createGoogleRealtimeBrowserSession,
  };
}
//#endregion
export { buildGoogleRealtimeVoiceProvider };
