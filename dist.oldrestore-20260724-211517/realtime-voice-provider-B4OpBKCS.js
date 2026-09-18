import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import WebSocket$1 from "ws";
import {
  n as createDebugProxyWebSocketAgent,
  r as resolveDebugProxySettings,
} from "./env-CAvwY92q.js";
import { s as warn } from "./globals-CNUzHTcU.js";
import "./runtime-env-D0V-7Gqz.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import "./proxy-capture-BPyIb8Rh.js";
import {
  c as resolveProviderAuthProfileApiKey,
  i as isProviderAuthProfileConfigured,
} from "./provider-auth-mypr64nh.js";
import "./secret-input-D1aG0n6v.js";
import "./provider-http-BDIltggC.js";
import { c as resolveProviderRequestHeaders } from "./provider-request-config-DpW-uV6A.js";
import "./realtime-voice-DQqBL-aH.js";
import {
  a as resolveOpenAIProviderConfigRecord,
  i as readRealtimeErrorDetail,
  n as createOpenAIRealtimeClientSecret,
  o as trimToUndefined,
  t as captureOpenAIRealtimeWsClose,
} from "./realtime-provider-shared-D_z6PPoJ.js";
import {
  n as OPENAI_GPT_LIVE_BROWSER_SESSION_UNSUPPORTED_MESSAGE,
  r as isOpenAIGptLiveModel,
  t as OPENAI_GPT_LIVE_BRIDGE_UNSUPPORTED_MESSAGE,
} from "./realtime-quicksilver-BMbjWVJt.js";
import { n as captureWsEvent } from "./runtime-eYTs6VkC.js";
import {
  Q as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
  Z as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
} from "./session-log-runtime-DVXN-XFR.js";
import {
  f as normalizeResolvedSecretInputString,
  p as normalizeSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
//#region extensions/openai/realtime-voice-provider.ts
const OPENAI_REALTIME_DEFAULT_MODEL = "gpt-realtime-2.1";
const OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const OPENAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX =
  "Conversation already has an active response in progress:";
const OPENAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR =
  "Cancellation failed: no active response found";
const OPENAI_REALTIME_MAX_SESSION_DURATION_FRAGMENT = "maximum duration";
const OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;
const OPENAI_REALTIME_DEFAULT_MIN_BARGE_IN_AUDIO_END_MS = 250;
const OPENAI_REALTIME_TOOL_NAME_RE = /^[A-Za-z0-9_-]+$/;
const AZURE_OPENAI_REALTIME_TOOL_NAME_MAX_LENGTH = 64;
const OPENAI_REALTIME_VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
];
function normalizeOpenAIRealtimeVoice(value) {
  if (typeof value !== "string") return;
  const normalized = value.trim().toLowerCase();
  return OPENAI_REALTIME_VOICES.includes(normalized) ? normalized : void 0;
}
function normalizeProviderConfig(config) {
  const raw = resolveOpenAIProviderConfigRecord(config);
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw?.apiKey,
      path: "plugins.entries.voice-call.config.realtime.providers.openai.apiKey",
    }),
    model: trimToUndefined(raw?.model),
    voice: normalizeOpenAIRealtimeVoice(raw?.speakerVoice ?? raw?.voice),
    temperature: asFiniteNumber(raw?.temperature),
    vadThreshold: asUnitInterval(raw?.vadThreshold),
    silenceDurationMs: asNonNegativeInteger(raw?.silenceDurationMs),
    prefixPaddingMs: asNonNegativeInteger(raw?.prefixPaddingMs),
    interruptResponseOnInputAudio:
      typeof raw?.interruptResponseOnInputAudio === "boolean"
        ? raw.interruptResponseOnInputAudio
        : void 0,
    minBargeInAudioEndMs: asNonNegativeInteger(raw?.minBargeInAudioEndMs),
    reasoningEffort: trimToUndefined(raw?.reasoningEffort),
    azureEndpoint: trimToUndefined(raw?.azureEndpoint),
    azureDeployment: trimToUndefined(raw?.azureDeployment),
    azureApiVersion: trimToUndefined(raw?.azureApiVersion),
  };
}
function asNonNegativeInteger(value) {
  const number = asFiniteNumber(value);
  return number !== void 0 && Number.isSafeInteger(number) && number >= 0 ? number : void 0;
}
function asUnitInterval(value) {
  const number = asFiniteNumber(value);
  return number !== void 0 && number >= 0 && number <= 1 ? number : void 0;
}
const OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED =
  "OpenAI Realtime voice requires an OpenAI Platform API key";
const OPENAI_REALTIME_API_KEY_REQUIRED = "OpenAI Realtime voice requires an API key";
const OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED =
  "OpenAI Realtime rejected the selected API key. Update or remove the active OpenAI API-key source";
const KEYCHAIN_SECRET_REF_RE = /^keychain:([^:]+):([^:]+)$/;
const KEYCHAIN_LOOKUP_TIMEOUT_MS = 5e3;
const resolvedKeychainSecretRefCache = /* @__PURE__ */ new Map();
function resolveKeychainSecretRef(value) {
  const trimmed = value.trim();
  const match = KEYCHAIN_SECRET_REF_RE.exec(trimmed);
  if (!match) return trimmed || void 0;
  const cached = resolvedKeychainSecretRefCache.get(trimmed);
  if (cached) return cached;
  const [, service, account] = match;
  if (!service || !account) return;
  try {
    const resolved =
      execFileSync(
        "/usr/bin/security",
        ["find-generic-password", "-s", service, "-a", account, "-w"],
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
          timeout: KEYCHAIN_LOOKUP_TIMEOUT_MS,
        },
      ).trim() || void 0;
    if (resolved) resolvedKeychainSecretRefCache.set(trimmed, resolved);
    return resolved;
  } catch {
    return;
  }
}
function resolveOpenAIRealtimeSecretInput(configuredApiKey) {
  const configured = normalizeSecretInputString(configuredApiKey);
  if (configured) {
    const value = resolveKeychainSecretRef(configured);
    return value
      ? {
          status: "available",
          value,
        }
      : { status: "missing" };
  }
  return { status: "missing" };
}
function resolveOpenAIRealtimeEnvApiKey() {
  const envValue = normalizeSecretInputString(process.env.OPENAI_API_KEY);
  if (!envValue) return { status: "missing" };
  const value = resolveKeychainSecretRef(envValue);
  return value
    ? {
        status: "available",
        value,
      }
    : { status: "missing" };
}
function resolveOpenAIRealtimeApiKey(configuredApiKey) {
  const configured = resolveOpenAIRealtimeSecretInput(configuredApiKey);
  if (configured.status === "available" || hasOpenAIRealtimeConfiguredApiKeyInput(configuredApiKey))
    return configured;
  return resolveOpenAIRealtimeEnvApiKey();
}
function requireOpenAIRealtimeApiKey(
  configuredApiKey,
  errorMessage = OPENAI_REALTIME_API_KEY_REQUIRED,
) {
  const resolved = resolveOpenAIRealtimeApiKey(configuredApiKey);
  if (resolved.status === "available") return resolved.value;
  throw new Error(errorMessage);
}
function hasOpenAIRealtimeConfiguredApiKeyInput(configuredApiKey) {
  return Boolean(normalizeSecretInputString(configuredApiKey));
}
function hasOpenAIRealtimeApiKeyInput(configuredApiKey) {
  return Boolean(
    normalizeSecretInputString(configuredApiKey) ??
    normalizeSecretInputString(process.env.OPENAI_API_KEY),
  );
}
function normalizeOpenAIRealtimeTools(tools, maxNameLength) {
  const normalized = [];
  let omitted = 0;
  for (const tool of tools ?? [])
    try {
      const name = tool.name;
      if (typeof name !== "string") {
        omitted += 1;
        continue;
      }
      if (
        (maxNameLength !== void 0 && name.length > maxNameLength) ||
        !OPENAI_REALTIME_TOOL_NAME_RE.test(name)
      ) {
        omitted += 1;
        continue;
      }
      normalized.push({
        type: "function",
        name,
        description: tool.description,
        parameters: tool.parameters,
      });
    } catch {
      omitted += 1;
    }
  if (omitted > 0)
    warn(`openai realtime: omitted ${omitted} tool definition(s) with unsupported names`);
  return normalized.length > 0 ? normalized : void 0;
}
async function resolveOpenAIRealtimePlatformAuth(params) {
  const configured = resolveOpenAIRealtimeSecretInput(params.configuredApiKey);
  if (
    configured.status === "available" ||
    hasOpenAIRealtimeConfiguredApiKeyInput(params.configuredApiKey)
  )
    return configured;
  const profileApiKey = await resolveProviderAuthProfileApiKey({
    provider: "openai",
    cfg: params.cfg,
    profileTypes: ["api_key"],
  });
  if (profileApiKey)
    return {
      status: "available",
      value: profileApiKey,
    };
  const hasConfiguredApiKeyProfile = isProviderAuthProfileConfigured({
    provider: "openai",
    cfg: params.cfg,
    profileTypes: ["api_key"],
  });
  const envApiKey = resolveOpenAIRealtimeEnvApiKey();
  if (envApiKey.status === "available") return envApiKey;
  if (hasConfiguredApiKeyProfile || hasOpenAIRealtimeApiKeyInput(void 0))
    return { status: "missing" };
  return { status: "missing" };
}
async function requireOpenAIRealtimePlatformAuth(params) {
  const resolved = await resolveOpenAIRealtimePlatformAuth(params);
  if (resolved.status === "available") return resolved;
  throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
}
function hasOpenAIRealtimePlatformAuthInput(params) {
  if (hasOpenAIRealtimeConfiguredApiKeyInput(params.configuredApiKey)) return true;
  if (
    isProviderAuthProfileConfigured({
      provider: "openai",
      cfg: params.cfg,
      profileTypes: ["api_key"],
    })
  )
    return true;
  return hasOpenAIRealtimeApiKeyInput(void 0);
}
function isOpenAIRealtimeMaxSessionDurationError(detail) {
  const normalized = detail.toLowerCase();
  return (
    normalized.includes("session") &&
    normalized.includes(OPENAI_REALTIME_MAX_SESSION_DURATION_FRAGMENT)
  );
}
function readRealtimeErrorEventId(error) {
  if (!error || typeof error !== "object") return;
  const eventId = error.event_id;
  return typeof eventId === "string" ? eventId : void 0;
}
function base64ToBuffer(b64) {
  return Buffer.from(b64, "base64");
}
var OpenAIRealtimeVoiceBridge = class OpenAIRealtimeVoiceBridge {
  static {
    this.DEFAULT_MODEL = OPENAI_REALTIME_DEFAULT_MODEL;
  }
  static {
    this.MAX_RECONNECT_ATTEMPTS = 5;
  }
  static {
    this.BASE_RECONNECT_DELAY_MS = 1e3;
  }
  static {
    this.CONNECT_TIMEOUT_MS = 1e4;
  }
  constructor(config) {
    this.config = config;
    this.supportsToolResultContinuation = true;
    this.supportsToolResultSuppression = true;
    this.ws = null;
    this.connected = false;
    this.sessionConfigured = false;
    this.intentionallyClosed = false;
    this.reconnectAttempts = 0;
    this.pendingAudio = [];
    this.markQueue = [];
    this.responseStartTimestamp = null;
    this.responseActive = false;
    this.responseCreateInFlight = false;
    this.manualResponseCreateEventId = null;
    this.responseCancelInFlight = false;
    this.manualResponseCancelEventId = null;
    this.responseCreatePending = false;
    this.autoRespondSuppressedForManualResponse = false;
    this.continuingToolCallIds = /* @__PURE__ */ new Set();
    this.latestMediaTimestamp = 0;
    this.lastAssistantItemId = null;
    this.connectionUrl = "";
    this.toolCallBuffers = /* @__PURE__ */ new Map();
    this.deliveredToolCallKeys = /* @__PURE__ */ new Set();
    this.flowId = randomUUID();
    this.sessionReadyFired = false;
    this.audioFormat = config.audioFormat ?? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ;
  }
  async connect() {
    this.intentionallyClosed = false;
    this.reconnectAttempts = 0;
    await this.doConnect();
  }
  sendAudio(audio) {
    if (!this.connected || !this.sessionConfigured || this.ws?.readyState !== WebSocket$1.OPEN) {
      if (this.pendingAudio.length < 320) this.pendingAudio.push(audio);
      return;
    }
    this.sendEvent({
      type: "input_audio_buffer.append",
      audio: audio.toString("base64"),
    });
  }
  setMediaTimestamp(ts) {
    this.latestMediaTimestamp = ts;
  }
  sendUserMessage(text) {
    this.sendEvent({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text,
          },
        ],
      },
    });
    this.requestResponseCreate();
  }
  triggerGreeting(instructions) {
    if (!this.isConnected() || !this.ws) return;
    this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the meeting.");
  }
  submitToolResult(callId, result, options) {
    this.sendEvent({
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: callId,
        output: JSON.stringify(result),
      },
    });
    if (options?.willContinue === true) {
      this.continuingToolCallIds.add(callId);
      return;
    }
    this.continuingToolCallIds.delete(callId);
    if (options?.suppressResponse === true) return;
    this.requestResponseCreate();
  }
  acknowledgeMark(markName) {
    const index = markName === void 0 ? 0 : this.markQueue.indexOf(markName);
    if (index >= 0) this.markQueue.splice(index, 1);
  }
  close() {
    this.intentionallyClosed = true;
    this.connected = false;
    this.sessionConfigured = false;
    if (this.ws) {
      this.ws.close(1e3, "Bridge closed");
      this.ws = null;
    }
  }
  isConnected() {
    return this.connected && this.sessionConfigured;
  }
  async doConnect() {
    await new Promise((resolve, reject) => {
      let settled = false;
      let startupFailureClosing = false;
      const settleResolve = () => {
        if (settled) return;
        settled = true;
        clearTimeout(connectTimeout);
        resolve();
      };
      const settleReject = (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(connectTimeout);
        reject(error);
      };
      const connectTimeout = setTimeout(() => {
        if (!this.sessionConfigured && !this.intentionallyClosed) {
          startupFailureClosing = true;
          this.ws?.terminate();
          settleReject(/* @__PURE__ */ new Error("OpenAI realtime connection timeout"));
        }
      }, OpenAIRealtimeVoiceBridge.CONNECT_TIMEOUT_MS);
      const openWebSocket = (connection) => {
        if (settled) return;
        if (this.intentionallyClosed) {
          settleResolve();
          return;
        }
        const url = connection.url;
        this.connectionUrl = connection.url;
        const proxyAgent = createDebugProxyWebSocketAgent(resolveDebugProxySettings());
        const ws = new WebSocket$1(connection.url, {
          headers: connection.headers,
          maxPayload: OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES,
          ...(proxyAgent ? { agent: proxyAgent } : {}),
        });
        this.ws = ws;
        const rejectStartup = (error) => {
          startupFailureClosing = true;
          settleReject(error);
          if (ws.readyState !== WebSocket$1.CLOSED) ws.close(1e3, "startup failed");
        };
        ws.on("open", () => {
          this.resetRealtimeSessionState();
          this.connected = true;
          this.sessionConfigured = false;
          this.reconnectAttempts = 0;
          captureWsEvent({
            url,
            direction: "local",
            kind: "ws-open",
            flowId: this.flowId,
            meta: {
              provider: "openai",
              capability: "realtime-voice",
            },
          });
          this.sendSessionUpdate();
        });
        ws.on("message", (data) => {
          if (settled && !this.sessionConfigured) return;
          captureWsEvent({
            url,
            direction: "inbound",
            kind: "ws-frame",
            flowId: this.flowId,
            payload: data,
            meta: {
              provider: "openai",
              capability: "realtime-voice",
            },
          });
          try {
            const event = JSON.parse(data.toString());
            if (event.type === "error" && !this.sessionConfigured) {
              rejectStartup(new Error(readRealtimeErrorDetail(event.error)));
              return;
            }
            this.handleEvent(event);
            if (event.type === "session.updated") settleResolve();
          } catch (error) {
            console.error("[openai] realtime event parse failed:", error);
          }
        });
        ws.on("error", (error) => {
          captureWsEvent({
            url,
            direction: "local",
            kind: "error",
            flowId: this.flowId,
            errorText: error instanceof Error ? error.message : String(error),
            meta: {
              provider: "openai",
              capability: "realtime-voice",
            },
          });
          if (!this.sessionConfigured) {
            rejectStartup(error instanceof Error ? error : new Error(String(error)));
            return;
          }
          this.config.onError?.(error instanceof Error ? error : new Error(String(error)));
        });
        ws.on("close", (code, reasonBuffer) => {
          captureOpenAIRealtimeWsClose({
            url,
            flowId: this.flowId,
            capability: "realtime-voice",
            code,
            reasonBuffer,
          });
          if (startupFailureClosing) {
            if (this.ws === ws) {
              this.connected = false;
              this.sessionConfigured = false;
            }
            return;
          }
          const wasSessionConfigured = this.sessionConfigured;
          this.connected = false;
          this.sessionConfigured = false;
          if (this.intentionallyClosed) {
            settleResolve();
            this.config.onClose?.("completed");
            return;
          }
          if (!wasSessionConfigured && !settled) {
            settleReject(
              /* @__PURE__ */ new Error("OpenAI realtime connection closed before ready"),
            );
            return;
          }
          const reason = this.reconnectReason ?? "websocket-close";
          this.reconnectReason = void 0;
          this.attemptReconnect(reason);
        });
      };
      const connectionOrPromise = this.resolveConnectionParams();
      if (connectionOrPromise instanceof Promise) {
        connectionOrPromise.then(openWebSocket).catch((error) => {
          settleReject(error instanceof Error ? error : new Error(String(error)));
        });
        return;
      }
      openWebSocket(connectionOrPromise);
    });
  }
  resolveConnectionParams() {
    const cfg = this.config;
    const model = cfg.model ?? OpenAIRealtimeVoiceBridge.DEFAULT_MODEL;
    if (cfg.azureEndpoint && cfg.azureDeployment) {
      const apiKey = requireOpenAIRealtimeApiKey(cfg.apiKey);
      const url = `${cfg.azureEndpoint.replace(/\/$/, "").replace(/^http(s?):/, (_, secure) => `ws${secure}:`)}/openai/realtime?api-version=${cfg.azureApiVersion ?? "2024-10-01-preview"}&deployment=${encodeURIComponent(cfg.azureDeployment)}`;
      return {
        url,
        headers: resolveProviderRequestHeaders({
          provider: "openai",
          baseUrl: url,
          capability: "audio",
          transport: "websocket",
          defaultHeaders: { "api-key": apiKey },
        }) ?? { "api-key": apiKey },
      };
    }
    if (hasOpenAIRealtimeConfiguredApiKeyInput(cfg.apiKey)) {
      const directApiKey = resolveOpenAIRealtimeSecretInput(cfg.apiKey);
      if (directApiKey.status === "missing")
        throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
      return this.resolveApiKeyConnectionParams(directApiKey.value, model);
    }
    if (cfg.azureEndpoint) {
      const directApiKey = resolveOpenAIRealtimeEnvApiKey();
      if (directApiKey.status === "missing") throw new Error(OPENAI_REALTIME_API_KEY_REQUIRED);
      return this.resolveApiKeyConnectionParams(directApiKey.value, model);
    }
    return this.resolveDefaultConnectionParams(model);
  }
  async resolveDefaultConnectionParams(model) {
    const auth = await requireOpenAIRealtimePlatformAuth({
      configuredApiKey: this.config.apiKey,
      cfg: this.config.cfg,
    });
    return this.resolveApiKeyConnectionParams(auth.value, model);
  }
  resolveApiKeyConnectionParams(apiKey, model) {
    const cfg = this.config;
    if (cfg.azureEndpoint) {
      const url = `${cfg.azureEndpoint.replace(/\/$/, "").replace(/^http(s?):/, (_, secure) => `ws${secure}:`)}/v1/realtime?model=${encodeURIComponent(model)}`;
      return {
        url,
        headers: resolveProviderRequestHeaders({
          provider: "openai",
          baseUrl: url,
          capability: "audio",
          transport: "websocket",
          defaultHeaders: { Authorization: `Bearer ${apiKey}` },
        }) ?? { Authorization: `Bearer ${apiKey}` },
      };
    }
    const url = `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`;
    return {
      url,
      headers: resolveProviderRequestHeaders({
        provider: "openai",
        baseUrl: url,
        capability: "audio",
        transport: "websocket",
        defaultHeaders: { Authorization: `Bearer ${apiKey}` },
      }) ?? { Authorization: `Bearer ${apiKey}` },
    };
  }
  async attemptReconnect(reason) {
    if (this.intentionallyClosed) return;
    if (this.reconnectAttempts >= OpenAIRealtimeVoiceBridge.MAX_RECONNECT_ATTEMPTS) {
      this.config.onEvent?.({
        direction: "client",
        type: "session.reconnect.exhausted",
        detail: `reason=${reason} attempts=${this.reconnectAttempts}`,
      });
      this.config.onClose?.("error");
      return;
    }
    this.reconnectAttempts += 1;
    const attempt = this.reconnectAttempts;
    const delay = OpenAIRealtimeVoiceBridge.BASE_RECONNECT_DELAY_MS * 2 ** (attempt - 1);
    this.config.onEvent?.({
      direction: "client",
      type: "session.reconnect.scheduled",
      detail: `reason=${reason} attempt=${attempt} delayMs=${delay}`,
    });
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
    if (this.intentionallyClosed) return;
    try {
      await this.doConnect();
      this.config.onEvent?.({
        direction: "client",
        type: "session.reconnect.ready",
        detail: `reason=${reason} attempt=${attempt}`,
      });
    } catch (error) {
      this.config.onError?.(error instanceof Error ? error : new Error(String(error)));
      await this.attemptReconnect(reason);
    }
  }
  sendSessionUpdate() {
    if (this.usesAzureDeploymentRealtimeApi()) {
      this.sendEvent(this.buildAzureDeploymentSessionUpdate());
      return;
    }
    this.sendEvent(this.buildGaSessionUpdate());
  }
  buildGaSessionUpdate() {
    const cfg = this.config;
    const tools = normalizeOpenAIRealtimeTools(cfg.tools);
    return {
      type: "session.update",
      session: {
        type: "realtime",
        model: cfg.model ?? OpenAIRealtimeVoiceBridge.DEFAULT_MODEL,
        instructions: cfg.instructions,
        output_modalities: ["audio"],
        audio: {
          input: {
            format: this.resolveRealtimeAudioFormat(),
            noise_reduction: null,
            transcription: { model: OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL },
            turn_detection: this.buildTurnDetectionConfig({ includeInterruptResponse: true }),
          },
          output: {
            format: this.resolveRealtimeAudioFormat(),
            voice: cfg.voice ?? "alloy",
          },
        },
        ...(cfg.reasoningEffort ? { reasoning: { effort: cfg.reasoningEffort } } : {}),
        ...(tools
          ? {
              tools,
              tool_choice: "auto",
            }
          : {}),
      },
    };
  }
  usesAzureDeploymentRealtimeApi() {
    return Boolean(this.config.azureEndpoint && this.config.azureDeployment);
  }
  buildAzureDeploymentSessionUpdate() {
    const cfg = this.config;
    const format = this.resolveLegacyRealtimeAudioFormat();
    const tools = normalizeOpenAIRealtimeTools(
      cfg.tools,
      AZURE_OPENAI_REALTIME_TOOL_NAME_MAX_LENGTH,
    );
    return {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: cfg.instructions,
        voice: cfg.voice ?? "alloy",
        input_audio_format: format,
        output_audio_format: format,
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: this.buildTurnDetectionConfig(),
        temperature: cfg.temperature ?? 0.8,
        ...(tools
          ? {
              tools,
              tool_choice: "auto",
            }
          : {}),
      },
    };
  }
  buildTurnDetectionConfig(options) {
    const configuredAutoResponse = this.config.autoRespondToAudio ?? true;
    return {
      type: "server_vad",
      threshold: this.config.vadThreshold ?? 0.5,
      prefix_padding_ms: this.config.prefixPaddingMs ?? 300,
      silence_duration_ms: this.config.silenceDurationMs ?? 500,
      create_response: options?.createResponse ?? configuredAutoResponse,
      ...(options?.includeInterruptResponse
        ? {
            interrupt_response: this.config.interruptResponseOnInputAudio ?? configuredAutoResponse,
          }
        : {}),
    };
  }
  sendAutoResponseSessionUpdate(createResponse) {
    const azureDeployment = this.usesAzureDeploymentRealtimeApi();
    const turnDetection = this.buildTurnDetectionConfig({
      createResponse,
      includeInterruptResponse: !azureDeployment,
    });
    if (azureDeployment) {
      this.sendEvent({
        type: "session.update",
        session: { turn_detection: turnDetection },
      });
      return;
    }
    this.sendEvent({
      type: "session.update",
      session: {
        type: "realtime",
        audio: { input: { turn_detection: turnDetection } },
      },
    });
  }
  resolveRealtimeAudioFormat() {
    return this.audioFormat.encoding === "pcm16"
      ? {
          type: "audio/pcm",
          rate: 24e3,
        }
      : { type: "audio/pcmu" };
  }
  resolveLegacyRealtimeAudioFormat() {
    return this.audioFormat.encoding === "pcm16" ? "pcm16" : "g711_ulaw";
  }
  handleEvent(event) {
    const emitServerEvent = () =>
      this.config.onEvent?.({
        direction: "server",
        type: event.type,
        detail: this.describeServerEvent(event),
        ...(event.item_id ? { itemId: event.item_id } : {}),
        ...((event.response_id ?? event.response?.id)
          ? { responseId: event.response_id ?? event.response?.id }
          : {}),
      });
    if (
      event.type === "error" &&
      isOpenAIRealtimeMaxSessionDurationError(readRealtimeErrorDetail(event.error))
    ) {
      this.reconnectReason = "max-duration";
      this.activeConnectionReason = "max-duration";
      this.config.onEvent?.({
        direction: "server",
        type: "session.rotation",
        detail: "reason=max-duration",
      });
      this.ws?.close(1e3, "max-duration rotation");
      return;
    }
    emitServerEvent();
    switch (event.type) {
      case "session.created":
        return;
      case "session.updated":
        this.sessionConfigured = true;
        if (this.activeConnectionReason) {
          this.config.onEvent?.({
            direction: "server",
            type: "session.rotation.ready",
            detail: `reason=${this.activeConnectionReason}`,
          });
          this.activeConnectionReason = void 0;
        }
        if (!this.sessionReadyFired) {
          this.sessionReadyFired = true;
          this.config.onReady?.();
        }
        for (const chunk of this.pendingAudio.splice(0)) this.sendAudio(chunk);
        return;
      case "response.created":
        this.responseActive = true;
        this.responseCreateInFlight = false;
        return;
      case "conversation.output_audio.delta":
      case "response.audio.delta":
      case "response.output_audio.delta": {
        const audioDelta = event.delta ?? event.data;
        if (!audioDelta) return;
        const audio = base64ToBuffer(audioDelta);
        this.config.onAudio(audio);
        if (event.item_id && event.item_id !== this.lastAssistantItemId) {
          this.lastAssistantItemId = event.item_id;
          this.responseStartTimestamp = this.latestMediaTimestamp;
        } else if (this.responseStartTimestamp === null)
          this.responseStartTimestamp = this.latestMediaTimestamp;
        this.responseActive = true;
        this.sendMark();
        return;
      }
      case "input_audio_buffer.speech_started":
        if (this.config.interruptResponseOnInputAudio ?? this.config.autoRespondToAudio ?? true)
          this.handleBargeIn();
        return;
      case "conversation.output_transcript.delta":
      case "response.output_text.delta":
      case "response.audio_transcript.delta":
      case "response.output_audio_transcript.delta":
        if (event.delta) this.config.onTranscript?.("assistant", event.delta, false);
        return;
      case "response.output_text.done":
      case "response.audio_transcript.done":
      case "response.output_audio_transcript.done":
        {
          const transcript = event.transcript ?? event.text;
          if (transcript) this.config.onTranscript?.("assistant", transcript, true);
        }
        return;
      case "conversation.input_transcript.delta":
      case "conversation.item.input_audio_transcription.delta":
        if (event.delta) this.config.onTranscript?.("user", event.delta, false);
        return;
      case "conversation.item.input_audio_transcription.completed":
        if (event.transcript) this.config.onTranscript?.("user", event.transcript, true);
        return;
      case "response.cancelled":
      case "response.done":
        this.responseActive = false;
        this.responseCreateInFlight = false;
        this.manualResponseCreateEventId = null;
        this.responseCancelInFlight = false;
        this.manualResponseCancelEventId = null;
        if (this.responseCreatePending) this.flushPendingResponseCreate();
        else this.restoreAutoRespondAfterManualResponse();
        return;
      case "response.function_call_arguments.delta": {
        const key = event.item_id ?? "unknown";
        const existing = this.toolCallBuffers.get(key);
        if (existing && event.delta) existing.args += event.delta;
        else if (event.item_id)
          this.toolCallBuffers.set(event.item_id, {
            name: event.name ?? "",
            callId: event.call_id ?? "",
            args: event.delta ?? "",
          });
        return;
      }
      case "response.function_call_arguments.done": {
        const key = event.item_id ?? "unknown";
        const buffered = this.toolCallBuffers.get(key);
        this.emitToolCallOnce({
          itemId: event.item_id,
          callId: buffered?.callId || event.call_id,
          name: buffered?.name || event.name,
          rawArgs: buffered?.args || event.arguments,
        });
        this.toolCallBuffers.delete(key);
        return;
      }
      case "conversation.item.done":
        if (event.item?.type !== "function_call") return;
        this.emitToolCallOnce({
          itemId: event.item.id ?? event.item_id,
          callId: event.item.call_id ?? event.call_id ?? event.item.id ?? event.item_id,
          name: event.item.name ?? event.name,
          rawArgs: event.item.arguments ?? event.arguments,
        });
        return;
      case "error": {
        const detail = readRealtimeErrorDetail(event.error);
        const rejectsManualResponseCreate =
          this.manualResponseCreateEventId !== null &&
          readRealtimeErrorEventId(event.error) === this.manualResponseCreateEventId;
        if (
          rejectsManualResponseCreate &&
          detail.startsWith(OPENAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX)
        ) {
          this.responseActive = true;
          this.responseCreateInFlight = false;
          this.manualResponseCreateEventId = null;
          this.responseCreatePending = true;
          return;
        }
        const rejectsManualResponseCancel =
          this.manualResponseCancelEventId !== null &&
          readRealtimeErrorEventId(event.error) === this.manualResponseCancelEventId;
        if (detail === OPENAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR) {
          if (!rejectsManualResponseCancel) return;
          this.responseActive = false;
          this.responseCancelInFlight = false;
          this.manualResponseCancelEventId = null;
          if (this.responseCreatePending) this.flushPendingResponseCreate();
          else this.restoreAutoRespondAfterManualResponse();
          return;
        }
        if (rejectsManualResponseCreate) {
          this.responseCreateInFlight = false;
          this.manualResponseCreateEventId = null;
          if (this.responseCreatePending) this.flushPendingResponseCreate();
          else this.restoreAutoRespondAfterManualResponse();
        }
        this.config.onError?.(new Error(detail));
      }
      default:
    }
  }
  handleBargeIn(options) {
    const assistantItemId = this.lastAssistantItemId;
    const responseStartTimestamp = this.responseStartTimestamp;
    const force = options?.force === true;
    const shouldInterruptProvider =
      assistantItemId !== null &&
      ((responseStartTimestamp !== null &&
        (this.markQueue.length > 0 || options?.audioPlaybackActive === true)) ||
        force);
    const audioEndMs = shouldInterruptProvider
      ? Math.max(
          0,
          responseStartTimestamp === null
            ? this.latestMediaTimestamp
            : this.latestMediaTimestamp - responseStartTimestamp,
        )
      : null;
    const minBargeInAudioEndMs =
      this.config.minBargeInAudioEndMs ?? OPENAI_REALTIME_DEFAULT_MIN_BARGE_IN_AUDIO_END_MS;
    if (!force && audioEndMs !== null && audioEndMs < minBargeInAudioEndMs) {
      this.config.onEvent?.({
        direction: "client",
        type: "conversation.item.truncate.skipped",
        detail: `reason=barge-in audioEndMs=${audioEndMs} minAudioEndMs=${minBargeInAudioEndMs}`,
      });
      return;
    }
    if (
      options?.audioPlaybackActive === true &&
      this.responseActive &&
      !this.responseCancelInFlight
    ) {
      const eventId = `openclaw-response-cancel-${randomUUID()}`;
      this.manualResponseCancelEventId = eventId;
      this.sendEvent(
        {
          type: "response.cancel",
          event_id: eventId,
        },
        "reason=barge-in",
      );
      this.responseCancelInFlight = true;
    }
    if (shouldInterruptProvider) {
      this.sendEvent(
        {
          type: "conversation.item.truncate",
          item_id: assistantItemId,
          content_index: 0,
          audio_end_ms: audioEndMs,
        },
        `reason=barge-in audioEndMs=${audioEndMs}`,
      );
      this.config.onClearAudio("barge-in");
      this.markQueue = [];
      this.lastAssistantItemId = null;
      this.responseStartTimestamp = null;
      return;
    }
    this.config.onClearAudio("barge-in");
  }
  emitToolCallOnce(fields) {
    if (!this.config.onToolCall) return;
    const itemId = fields.itemId || fields.callId || "unknown";
    const callId = fields.callId || itemId;
    const name = fields.name || "";
    const dedupeKey = fields.itemId || fields.callId || `${name}:${fields.rawArgs ?? ""}`;
    if (this.deliveredToolCallKeys.has(dedupeKey)) return;
    this.deliveredToolCallKeys.add(dedupeKey);
    let args = {};
    try {
      args = JSON.parse(fields.rawArgs || "{}");
    } catch {}
    this.config.onToolCall({
      itemId,
      callId,
      name,
      args,
    });
  }
  requestResponseCreate() {
    if (
      this.responseActive ||
      this.responseCreateInFlight ||
      this.responseCancelInFlight ||
      this.continuingToolCallIds.size > 0
    ) {
      this.responseCreatePending = true;
      return;
    }
    this.responseCreatePending = false;
    this.responseCreateInFlight = true;
    this.suppressAutoRespondForManualResponse();
    const eventId = `openclaw-response-create-${randomUUID()}`;
    this.manualResponseCreateEventId = eventId;
    this.sendEvent({
      type: "response.create",
      event_id: eventId,
    });
  }
  suppressAutoRespondForManualResponse() {
    if (this.config.autoRespondToAudio === false || this.autoRespondSuppressedForManualResponse)
      return;
    this.autoRespondSuppressedForManualResponse = true;
    this.sendAutoResponseSessionUpdate(false);
  }
  restoreAutoRespondAfterManualResponse() {
    if (!this.autoRespondSuppressedForManualResponse) return;
    this.autoRespondSuppressedForManualResponse = false;
    this.sendAutoResponseSessionUpdate(true);
  }
  flushPendingResponseCreate() {
    if (!this.responseCreatePending) return;
    this.responseCreatePending = false;
    this.requestResponseCreate();
  }
  resetRealtimeSessionState() {
    this.markQueue = [];
    this.responseStartTimestamp = null;
    this.responseActive = false;
    this.responseCreateInFlight = false;
    this.manualResponseCreateEventId = null;
    this.responseCancelInFlight = false;
    this.manualResponseCancelEventId = null;
    this.responseCreatePending = false;
    this.autoRespondSuppressedForManualResponse = false;
    this.continuingToolCallIds.clear();
    this.lastAssistantItemId = null;
    this.toolCallBuffers.clear();
    this.deliveredToolCallKeys.clear();
  }
  sendMark() {
    const markName = `audio-${Date.now()}`;
    this.markQueue.push(markName);
    this.config.onMark?.(markName);
  }
  sendEvent(event, detail) {
    if (this.ws?.readyState === WebSocket$1.OPEN) {
      const type =
        event && typeof event === "object" && typeof event.type === "string"
          ? event.type
          : "unknown";
      this.config.onEvent?.({
        direction: "client",
        type,
        ...(detail ? { detail } : {}),
      });
      const payload = JSON.stringify(event);
      captureWsEvent({
        url: this.connectionUrl,
        direction: "outbound",
        kind: "ws-frame",
        flowId: this.flowId,
        payload,
        meta: {
          provider: "openai",
          capability: "realtime-voice",
        },
      });
      this.ws.send(payload);
    }
  }
  describeServerEvent(event) {
    if (event.type === "error") return readRealtimeErrorDetail(event.error);
    if (event.type === "response.done") {
      const status = event.response?.status;
      const details =
        event.response?.status_details === void 0
          ? void 0
          : JSON.stringify(event.response.status_details);
      return [status ? `status=${status}` : void 0, details].filter(Boolean).join(" ") || void 0;
    }
    if (event.type === "response.cancelled") return "cancelled";
    if (event.type === "conversation.item.done" && event.item?.type)
      return [event.item.type, event.item.name ? `name=${event.item.name}` : void 0]
        .filter(Boolean)
        .join(" ");
  }
};
function resolveOpenAIRealtimeBrowserOfferHeaders() {
  const headers = resolveProviderRequestHeaders({
    provider: "openai",
    baseUrl: "https://api.openai.com/v1/realtime/calls",
    capability: "audio",
    transport: "http",
    defaultHeaders: {},
  });
  const SERVER_ONLY_HEADERS = /* @__PURE__ */ new Set(["user-agent", "originator", "version"]);
  const browserHeaders = Object.fromEntries(
    Object.entries(headers ?? {}).filter(([key]) => !SERVER_ONLY_HEADERS.has(key.toLowerCase())),
  );
  return Object.keys(browserHeaders).length > 0 ? browserHeaders : void 0;
}
async function createOpenAIRealtimeBrowserSession(req) {
  const config = normalizeProviderConfig(req.providerConfig);
  if (config.azureEndpoint || config.azureDeployment)
    throw new Error("OpenAI Realtime browser sessions do not support Azure endpoints yet");
  const model = req.model ?? config.model ?? OPENAI_REALTIME_DEFAULT_MODEL;
  if (isOpenAIGptLiveModel(model))
    throw new Error(OPENAI_GPT_LIVE_BROWSER_SESSION_UNSUPPORTED_MESSAGE);
  const auth = await requireOpenAIRealtimePlatformAuth({
    configuredApiKey: config.apiKey,
    cfg: req.cfg,
  });
  const voice = normalizeOpenAIRealtimeVoice(req.voice) ?? config.voice ?? "alloy";
  const tools = normalizeOpenAIRealtimeTools(req.tools);
  const session = {
    type: "realtime",
    model,
    instructions: req.instructions,
    audio: {
      input: {
        noise_reduction: { type: "near_field" },
        turn_detection: {
          type: "server_vad",
          create_response: true,
          interrupt_response: true,
          ...(typeof (req.vadThreshold ?? config.vadThreshold) === "number"
            ? { threshold: req.vadThreshold ?? config.vadThreshold }
            : {}),
          ...(typeof (req.prefixPaddingMs ?? config.prefixPaddingMs) === "number"
            ? { prefix_padding_ms: req.prefixPaddingMs ?? config.prefixPaddingMs }
            : {}),
          ...(typeof (req.silenceDurationMs ?? config.silenceDurationMs) === "number"
            ? { silence_duration_ms: req.silenceDurationMs ?? config.silenceDurationMs }
            : {}),
        },
        transcription: { model: OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL },
      },
      output: { voice },
    },
  };
  if (tools) {
    session.tools = tools;
    session.tool_choice = "auto";
  }
  const reasoningEffort = trimToUndefined(req.reasoningEffort) ?? config.reasoningEffort;
  if (reasoningEffort) session.reasoning = { effort: reasoningEffort };
  const clientSecret = await createOpenAIRealtimeClientSecret({
    authToken: auth.value,
    auditContext: "openai-realtime-browser-session",
    session,
    authRejectedMessage: OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED,
  });
  const offerHeaders = resolveOpenAIRealtimeBrowserOfferHeaders();
  return {
    provider: "openai",
    transport: "webrtc",
    clientSecret: clientSecret.value,
    offerUrl: "https://api.openai.com/v1/realtime/calls",
    ...(offerHeaders ? { offerHeaders } : {}),
    model,
    voice,
    ...(typeof clientSecret.expiresAt === "number" ? { expiresAt: clientSecret.expiresAt } : {}),
  };
}
function buildOpenAIRealtimeVoiceProvider() {
  return {
    id: "openai",
    label: "OpenAI Realtime Voice",
    defaultModel: OPENAI_REALTIME_DEFAULT_MODEL,
    autoSelectOrder: 10,
    capabilities: {
      transports: ["webrtc", "gateway-relay"],
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
    },
    resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
    isConfigured: ({ cfg, providerConfig }) => {
      const config = normalizeProviderConfig(providerConfig);
      if (config.azureEndpoint || config.azureDeployment)
        return hasOpenAIRealtimeApiKeyInput(config.apiKey);
      return hasOpenAIRealtimePlatformAuthInput({
        configuredApiKey: config.apiKey,
        cfg,
      });
    },
    createBridge: (req) => {
      const config = normalizeProviderConfig(req.providerConfig);
      if (isOpenAIGptLiveModel(config.model))
        throw new Error(OPENAI_GPT_LIVE_BRIDGE_UNSUPPORTED_MESSAGE);
      return new OpenAIRealtimeVoiceBridge({
        ...req,
        apiKey: config.apiKey,
        model: config.model,
        voice: config.voice,
        temperature: config.temperature,
        vadThreshold: config.vadThreshold,
        silenceDurationMs: config.silenceDurationMs,
        prefixPaddingMs: config.prefixPaddingMs,
        interruptResponseOnInputAudio:
          req.interruptResponseOnInputAudio ?? config.interruptResponseOnInputAudio,
        minBargeInAudioEndMs: config.minBargeInAudioEndMs,
        reasoningEffort: config.reasoningEffort,
        azureEndpoint: config.azureEndpoint,
        azureDeployment: config.azureDeployment,
        azureApiVersion: config.azureApiVersion,
      });
    },
    createBrowserSession: createOpenAIRealtimeBrowserSession,
  };
}
//#endregion
export { buildOpenAIRealtimeVoiceProvider as t };
