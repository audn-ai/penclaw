import crypto from "node:crypto";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import {
  i as chunkAudio,
  n as mapProviderStatusToEndReason,
  r as normalizeProviderStatus,
  t as isProviderStatusTerminal,
} from "./call-status-tmHQGDHg.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./api-CWVFC_kp.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import {
  c as verifyTwilioWebhook,
  i as readProviderJsonResponseText,
  n as cancelProviderResponseBody,
  r as readProviderErrorResponseSnippet,
  t as guardedJsonApiRequest,
} from "./guarded-json-api-BWc6aCjD.js";
import { n as getHeader } from "./proxy-ip-B3QWRNk3.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  n as requireSupportedTwilioApiHostname,
  r as resolveTwilioApiBaseUrl,
} from "./twilio-region-4fkgz3UG.js";
import { n as mapVoiceToPolly, t as escapeXml } from "./voice-mapping-D7mXhBrt.js";
//#region extensions/voice-call/src/providers/twilio/api.ts
const TWILIO_API_TIMEOUT_MS = 3e4;
/** Parse Twilio JSON error responses without trusting response shape. */
function parseTwilioApiError(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") return {};
    const record = parsed;
    return {
      code: typeof record.code === "number" ? record.code : void 0,
      message: typeof record.message === "string" ? record.message : void 0,
    };
  } catch {
    return {};
  }
}
/** Error thrown for non-2xx Twilio REST API responses. */
var TwilioApiError = class extends Error {
  constructor(httpStatus, responseText) {
    const parsed = parseTwilioApiError(responseText);
    const detail = parsed.message ?? responseText;
    super(`Twilio API error: ${httpStatus} ${detail}`);
    this.name = "TwilioApiError";
    this.httpStatus = httpStatus;
    this.responseText = responseText;
    this.twilioCode = parsed.code;
  }
};
/** POST a form-encoded Twilio REST API request through the SSRF guard. */
async function twilioApiRequest(params) {
  const bodyParams =
    params.body instanceof URLSearchParams
      ? params.body
      : Object.entries(params.body).reduce((acc, [key, value]) => {
          if (Array.isArray(value)) for (const entry of value) acc.append(key, entry);
          else if (typeof value === "string") acc.append(key, value);
          return acc;
        }, new URLSearchParams());
  const requestUrl = `${params.baseUrl}${params.endpoint}`;
  const allowedHostname = requireSupportedTwilioApiHostname(params.baseUrl);
  const { response, release } = await fetchWithSsrFGuard({
    url: requestUrl,
    init: {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${params.accountSid}:${params.authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams,
    },
    policy: { allowedHostnames: [allowedHostname] },
    timeoutMs: TWILIO_API_TIMEOUT_MS,
    auditContext: "voice-call.twilio.api",
  });
  try {
    if (!response.ok) {
      if (params.allowNotFound && response.status === 404) {
        await cancelProviderResponseBody(response);
        return;
      }
      const errorText = await readProviderErrorResponseSnippet(response);
      throw new TwilioApiError(response.status, errorText);
    }
    const text = await readProviderJsonResponseText(response);
    if (!text) return;
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Twilio API returned malformed JSON.");
    }
  } finally {
    await release();
  }
}
//#endregion
//#region extensions/voice-call/src/providers/twilio/twiml-policy.ts
/** Return true for Twilio outbound call directions. */
function isOutboundDirection(direction) {
  return direction?.startsWith("outbound") ?? false;
}
/** Read the Twilio request fields needed by TwiML decision logic. */
function readTwimlRequestView(ctx) {
  const params = new URLSearchParams(ctx.rawBody);
  const type = normalizeOptionalString(ctx.query?.type);
  const callIdFromQuery = normalizeOptionalString(ctx.query?.callId);
  return {
    callStatus: params.get("CallStatus"),
    direction: params.get("Direction"),
    isStatusCallback: type === "status",
    callSid: params.get("CallSid") || void 0,
    callIdFromQuery,
  };
}
/** Decide the TwiML response kind for a Twilio webhook request. */
function decideTwimlResponse(input) {
  if (input.callIdFromQuery && !input.isStatusCallback) {
    if (input.hasStoredTwiml)
      return {
        kind: "stored",
        consumeStoredTwimlCallId: input.callIdFromQuery,
      };
    if (input.isNotifyCall) return { kind: "empty" };
    if (isOutboundDirection(input.direction))
      return input.canStream ? { kind: "stream" } : { kind: "pause" };
  }
  if (input.isStatusCallback) return { kind: "empty" };
  if (input.direction === "inbound") {
    if (input.hasActiveStreams) return { kind: "queue" };
    if (input.canStream && input.callSid)
      return {
        kind: "stream",
        activateStreamCallSid: input.callSid,
      };
    return { kind: "pause" };
  }
  if (input.callStatus !== "in-progress") return { kind: "empty" };
  return input.canStream ? { kind: "stream" } : { kind: "pause" };
}
//#endregion
//#region extensions/voice-call/src/providers/twilio/webhook.ts
/** Verify a Twilio webhook and map SDK verification details to provider result fields. */
function verifyTwilioProviderWebhook(params) {
  const result = verifyTwilioWebhook(params.ctx, params.authToken, {
    publicUrl: params.currentPublicUrl || void 0,
    allowNgrokFreeTierLoopbackBypass: params.options.allowNgrokFreeTierLoopbackBypass ?? false,
    skipVerification: params.options.skipVerification,
    allowedHosts: params.options.webhookSecurity?.allowedHosts,
    trustForwardingHeaders: params.options.webhookSecurity?.trustForwardingHeaders,
    trustedProxyIPs: params.options.webhookSecurity?.trustedProxyIPs,
    remoteIP: params.ctx.remoteAddress,
  });
  if (!result.ok) console.warn(`[twilio] Webhook verification failed: ${result.reason}`);
  return {
    ok: result.ok,
    reason: result.reason,
    isReplay: result.isReplay,
    verifiedRequestKey: result.verifiedRequestKey,
  };
}
//#endregion
//#region extensions/voice-call/src/providers/twilio.ts
const TWILIO_CALL_NOT_IN_PROGRESS_CODE = 21220;
const TWILIO_CALL_UPDATE_RETRY_DELAYS_MS = [250, 750];
function isTwilioCallNotInProgressError(err) {
  return err instanceof TwilioApiError && err.twilioCode === TWILIO_CALL_NOT_IN_PROGRESS_CODE;
}
function createTwilioRequestDedupeKey(ctx, verifiedRequestKey) {
  if (verifiedRequestKey) return verifiedRequestKey;
  const signature = getHeader(ctx.headers, "x-twilio-signature") ?? "";
  const params = new URLSearchParams(ctx.rawBody);
  const callSid = params.get("CallSid") ?? "";
  const callStatus = params.get("CallStatus") ?? "";
  const direction = params.get("Direction") ?? "";
  const callId = normalizeOptionalString(ctx.query?.callId) ?? "";
  const flow = normalizeOptionalString(ctx.query?.flow) ?? "";
  const turnToken = normalizeOptionalString(ctx.query?.turnToken) ?? "";
  return `twilio:fallback:${crypto.createHash("sha256").update(`${signature}\n${callSid}\n${callStatus}\n${direction}\n${callId}\n${flow}\n${turnToken}\n${ctx.rawBody}`).digest("hex")}`;
}
var TwilioProvider = class TwilioProvider {
  /**
   * Delete stored TwiML for a given `callId`.
   *
   * We keep TwiML in-memory only long enough to satisfy the initial Twilio
   * webhook request (notify mode). Subsequent webhooks should not reuse it.
   */
  deleteStoredTwiml(callId) {
    this.twimlStorage.delete(callId);
    this.notifyCalls.delete(callId);
  }
  /**
   * Delete stored TwiML for a call, addressed by Twilio's provider call SID.
   *
   * This is used when we only have `providerCallId` (e.g. hangup).
   */
  deleteStoredTwimlForProviderCall(providerCallId) {
    const webhookUrl = this.callWebhookUrls.get(providerCallId);
    if (!webhookUrl) return;
    const callId = webhookUrl.match(/callId=([^&]+)/)?.[1];
    if (!callId) return;
    this.deleteStoredTwiml(callId);
    this.streamAuthTokens.delete(providerCallId);
  }
  constructor(config, options = {}) {
    this.name = "twilio";
    this.callWebhookUrls = /* @__PURE__ */ new Map();
    this.currentPublicUrl = null;
    this.ttsProvider = null;
    this.mediaStreamHandler = null;
    this.callStreamMap = /* @__PURE__ */ new Map();
    this.streamAuthTokens = /* @__PURE__ */ new Map();
    this.twimlStorage = /* @__PURE__ */ new Map();
    this.notifyCalls = /* @__PURE__ */ new Set();
    this.activeStreamCalls = /* @__PURE__ */ new Set();
    if (!config.accountSid) throw new Error("Twilio Account SID is required");
    if (!config.authToken) throw new Error("Twilio Auth Token is required");
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.baseUrl = resolveTwilioApiBaseUrl({
      accountSid: this.accountSid,
      region: config.region,
    });
    this.options = options;
    if (options.publicUrl) this.currentPublicUrl = options.publicUrl;
  }
  setPublicUrl(url) {
    this.currentPublicUrl = url;
  }
  setTTSProvider(provider) {
    this.ttsProvider = provider;
  }
  setMediaStreamHandler(handler) {
    this.mediaStreamHandler = handler;
  }
  registerCallStream(callSid, streamSid) {
    this.callStreamMap.set(callSid, streamSid);
    this.activeStreamCalls.add(callSid);
  }
  hasRegisteredStream(callSid) {
    return this.callStreamMap.has(callSid);
  }
  unregisterCallStream(callSid, streamSid) {
    const currentStreamSid = this.callStreamMap.get(callSid);
    if (!currentStreamSid) {
      if (!streamSid) this.activeStreamCalls.delete(callSid);
      return;
    }
    if (streamSid && currentStreamSid !== streamSid) return;
    this.callStreamMap.delete(callSid);
    this.activeStreamCalls.delete(callSid);
  }
  isConversationStreamConnectEnabled() {
    return Boolean(this.mediaStreamHandler && this.getStreamUrl());
  }
  isValidStreamToken(callSid, token) {
    const expected = this.streamAuthTokens.get(callSid);
    if (!expected || !token) return false;
    return safeEqualSecret(expected, token);
  }
  /**
   * Clear TTS queue for a call (barge-in).
   * Used when user starts speaking to interrupt current TTS playback.
   */
  clearTtsQueue(callSid, reason = "unspecified") {
    const streamSid = this.callStreamMap.get(callSid);
    if (!streamSid || !this.mediaStreamHandler) return;
    this.mediaStreamHandler.clearTtsQueue(streamSid, reason);
  }
  /**
   * Make an authenticated request to the Twilio API.
   */
  async apiRequest(endpoint, params, options) {
    return await twilioApiRequest({
      baseUrl: this.baseUrl,
      accountSid: this.accountSid,
      authToken: this.authToken,
      endpoint,
      body: params,
      allowNotFound: options?.allowNotFound,
    });
  }
  async updateLiveCallTwiml(providerCallId, twiml, operation) {
    for (const retryDelayMs of TWILIO_CALL_UPDATE_RETRY_DELAYS_MS)
      try {
        await this.apiRequest(`/Calls/${providerCallId}.json`, { Twiml: twiml });
        return;
      } catch (err) {
        if (!isTwilioCallNotInProgressError(err)) throw err;
        console.warn(
          `[voice-call] Twilio ${operation} update hit call state race (21220); retrying in ${retryDelayMs}ms`,
        );
        await setTimeout$1(retryDelayMs);
      }
    await this.apiRequest(`/Calls/${providerCallId}.json`, { Twiml: twiml });
  }
  /**
   * Verify Twilio webhook signature using HMAC-SHA1.
   *
   * Handles reverse proxy scenarios (Tailscale, nginx, ngrok) by reconstructing
   * the public URL from forwarding headers.
   *
   * @see https://www.twilio.com/docs/usage/webhooks/webhooks-security
   */
  verifyWebhook(ctx) {
    return verifyTwilioProviderWebhook({
      ctx,
      authToken: this.authToken,
      currentPublicUrl: this.currentPublicUrl,
      options: this.options,
    });
  }
  /**
   * Parse Twilio webhook event into normalized format.
   */
  parseWebhookEvent(ctx, options) {
    try {
      const params = new URLSearchParams(ctx.rawBody);
      const callIdFromQuery = normalizeOptionalString(ctx.query?.callId);
      const turnTokenFromQuery = normalizeOptionalString(ctx.query?.turnToken);
      const dedupeKey = createTwilioRequestDedupeKey(ctx, options?.verifiedRequestKey);
      const event = this.normalizeEvent(params, {
        callIdOverride: callIdFromQuery,
        dedupeKey,
        turnToken: turnTokenFromQuery,
      });
      const twiml = this.generateTwimlResponse(ctx);
      return {
        events: event ? [event] : [],
        providerResponseBody: twiml,
        providerResponseHeaders: { "Content-Type": "application/xml" },
        statusCode: 200,
      };
    } catch {
      return {
        events: [],
        statusCode: 400,
      };
    }
  }
  /**
   * Parse Twilio direction to normalized format.
   */
  static parseDirection(direction) {
    if (direction === "inbound") return "inbound";
    if (direction === "outbound-api" || direction === "outbound-dial") return "outbound";
  }
  static parseConfidence(value) {
    const trimmed = value?.trim();
    if (!trimmed || !/^\d+(?:\.\d+)?$/.test(trimmed)) return 0.9;
    return Number(trimmed);
  }
  /**
   * Convert Twilio webhook params to normalized event format.
   */
  normalizeEvent(params, options) {
    const callSid = params.get("CallSid") || "";
    const callIdOverride = options?.callIdOverride;
    const baseEvent = {
      id: crypto.randomUUID(),
      dedupeKey: options?.dedupeKey,
      callId: callIdOverride || callSid,
      providerCallId: callSid,
      timestamp: Date.now(),
      turnToken: options?.turnToken,
      direction: TwilioProvider.parseDirection(params.get("Direction")),
      from: params.get("From") || void 0,
      to: params.get("To") || void 0,
    };
    const speechResult = params.get("SpeechResult");
    if (speechResult)
      return {
        ...baseEvent,
        type: "call.speech",
        transcript: speechResult,
        isFinal: true,
        confidence: TwilioProvider.parseConfidence(params.get("Confidence")),
      };
    const digits = params.get("Digits");
    if (digits)
      return {
        ...baseEvent,
        type: "call.dtmf",
        digits,
      };
    const callStatus = normalizeProviderStatus(params.get("CallStatus"));
    if (callStatus === "initiated")
      return {
        ...baseEvent,
        type: "call.initiated",
      };
    if (callStatus === "ringing")
      return {
        ...baseEvent,
        type: "call.ringing",
      };
    if (callStatus === "in-progress")
      return {
        ...baseEvent,
        type: "call.answered",
      };
    const endReason = mapProviderStatusToEndReason(callStatus);
    if (endReason) {
      this.streamAuthTokens.delete(callSid);
      this.activeStreamCalls.delete(callSid);
      if (callIdOverride) this.deleteStoredTwiml(callIdOverride);
      return {
        ...baseEvent,
        type: "call.ended",
        reason: endReason,
      };
    }
    return null;
  }
  static {
    this.EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
  }
  static {
    this.PAUSE_TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="30"/>
</Response>`;
  }
  static {
    this.QUEUE_TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Please hold while we connect you.</Say>
  <Enqueue waitUrl="/voice/hold-music">hold-queue</Enqueue>
</Response>`;
  }
  /**
   * Generate TwiML response for webhook.
   * When a call is answered, connects to media stream for bidirectional audio.
   */
  generateTwimlResponse(ctx) {
    if (!ctx) return TwilioProvider.EMPTY_TWIML;
    const view = readTwimlRequestView(ctx);
    const storedTwiml = view.callIdFromQuery ? this.twimlStorage.get(view.callIdFromQuery) : void 0;
    const decision = decideTwimlResponse({
      ...view,
      hasStoredTwiml: Boolean(storedTwiml),
      isNotifyCall: view.callIdFromQuery ? this.notifyCalls.has(view.callIdFromQuery) : false,
      hasActiveStreams: this.activeStreamCalls.size > 0,
      canStream: Boolean(view.callSid && this.getStreamUrl()),
    });
    if (decision.consumeStoredTwimlCallId)
      this.deleteStoredTwiml(decision.consumeStoredTwimlCallId);
    switch (decision.kind) {
      case "stored":
        return storedTwiml ?? TwilioProvider.EMPTY_TWIML;
      case "queue":
        return TwilioProvider.QUEUE_TWIML;
      case "pause":
        return TwilioProvider.PAUSE_TWIML;
      case "stream": {
        const streamUrl = view.callSid ? this.getStreamUrlForCall(view.callSid) : null;
        return streamUrl ? this.getStreamConnectXml(streamUrl) : TwilioProvider.PAUSE_TWIML;
      }
      default:
        return TwilioProvider.EMPTY_TWIML;
    }
  }
  consumeInitialTwiML(ctx) {
    const view = readTwimlRequestView(ctx);
    if (!view.callIdFromQuery || view.isStatusCallback) return null;
    const storedTwiml = this.twimlStorage.get(view.callIdFromQuery);
    if (!storedTwiml) return null;
    const kind = this.notifyCalls.has(view.callIdFromQuery) ? "notify" : "pre-connect";
    this.deleteStoredTwiml(view.callIdFromQuery);
    console.log(
      `[voice-call] Twilio initial TwiML consumed for call ${view.callIdFromQuery} (kind=${kind}, callSid=${view.callSid ?? "unknown"})`,
    );
    return storedTwiml;
  }
  /**
   * Get the WebSocket URL for media streaming.
   * Derives from the public URL origin + stream path.
   */
  getStreamUrl() {
    if (!this.currentPublicUrl || !this.options.streamPath) return null;
    return `${new URL(this.currentPublicUrl).origin.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://")}${this.options.streamPath.startsWith("/") ? this.options.streamPath : `/${this.options.streamPath}`}`;
  }
  getStreamAuthToken(callSid) {
    const existing = this.streamAuthTokens.get(callSid);
    if (existing) return existing;
    const token = crypto.randomBytes(16).toString("base64url");
    this.streamAuthTokens.set(callSid, token);
    return token;
  }
  getStreamUrlForCall(callSid) {
    const baseUrl = this.getStreamUrl();
    if (!baseUrl) return null;
    const token = this.getStreamAuthToken(callSid);
    const url = new URL(baseUrl);
    url.searchParams.set("token", token);
    return url.toString();
  }
  /**
   * Generate TwiML to connect a call to a WebSocket media stream.
   * This enables bidirectional audio streaming for real-time STT/TTS.
   *
   * @param streamUrl - WebSocket URL (wss://...) for the media stream
   */
  getStreamConnectXml(streamUrl) {
    const parsed = new URL(streamUrl);
    const token = parsed.searchParams.get("token");
    parsed.searchParams.delete("token");
    const cleanUrl = parsed.toString();
    const paramXml = token ? `\n      <Parameter name="token" value="${escapeXml(token)}" />` : "";
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${escapeXml(cleanUrl)}">${paramXml}
    </Stream>
  </Connect>
</Response>`;
  }
  /**
   * Initiate an outbound call via Twilio API.
   * If preConnectTwiml is provided, the first webhook request receives that
   * TwiML before normal dynamic TwiML resumes.
   */
  async initiateCall(input) {
    const url = new URL(input.webhookUrl);
    url.searchParams.set("callId", input.callId);
    const statusUrl = new URL(input.webhookUrl);
    statusUrl.searchParams.set("callId", input.callId);
    statusUrl.searchParams.set("type", "status");
    if (!input.inlineTwiml && input.preConnectTwiml) {
      this.twimlStorage.set(input.callId, input.preConnectTwiml);
      console.log(
        `[voice-call] Stored Twilio initial TwiML for call ${input.callId} (kind=pre-connect)`,
      );
    }
    const params = {
      To: input.to,
      From: input.from,
      StatusCallback: statusUrl.toString(),
      StatusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      Timeout: "30",
    };
    if (input.inlineTwiml) {
      params.Twiml = input.inlineTwiml;
      console.log(
        `[voice-call] Sending direct Twilio initial TwiML for call ${input.callId} (kind=notify)`,
      );
    } else params.Url = url.toString();
    const result = await this.apiRequest("/Calls.json", params);
    this.callWebhookUrls.set(result.sid, url.toString());
    return {
      providerCallId: result.sid,
      status: result.status === "queued" ? "queued" : "initiated",
    };
  }
  /**
   * Hang up a call via Twilio API.
   */
  async hangupCall(input) {
    this.deleteStoredTwimlForProviderCall(input.providerCallId);
    this.callWebhookUrls.delete(input.providerCallId);
    this.streamAuthTokens.delete(input.providerCallId);
    this.activeStreamCalls.delete(input.providerCallId);
    await this.apiRequest(
      `/Calls/${input.providerCallId}.json`,
      { Status: "completed" },
      { allowNotFound: true },
    );
  }
  /**
   * Play TTS audio via Twilio.
   *
   * Two modes:
   * 1. Core TTS + Media Streams: when an active stream exists, stream playback is required.
   *    If telephony TTS is unavailable in that state, playback fails rather than mixing paths.
   * 2. TwiML <Say>: fallback only when there is no active stream for the call.
   */
  async playTts(input) {
    const streamSid = this.callStreamMap.get(input.providerCallId);
    if (streamSid) {
      if (!this.ttsProvider || !this.mediaStreamHandler)
        throw new Error(
          "Telephony TTS unavailable while media stream is active; refusing TwiML fallback",
        );
      try {
        await this.playTtsViaStream(input.text, streamSid);
        return;
      } catch (err) {
        console.warn(
          `[voice-call] Telephony TTS failed:`,
          err instanceof Error ? err.message : err,
        );
        throw err instanceof Error ? err : new Error(String(err));
      }
    }
    const webhookUrl = this.callWebhookUrls.get(input.providerCallId);
    if (!webhookUrl)
      throw new Error("Missing webhook URL for this call (provider state not initialized)");
    console.warn(
      "[voice-call] Using TwiML <Say> fallback - telephony TTS not configured or media stream not active",
    );
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${mapVoiceToPolly(input.voice)}" language="${input.locale || "en-US"}">${escapeXml(input.text)}</Say>
  <Gather input="speech" speechTimeout="auto" action="${escapeXml(webhookUrl)}" method="POST">
    <Say>.</Say>
  </Gather>
</Response>`;
    await this.updateLiveCallTwiml(input.providerCallId, twiml, "playTts");
  }
  async sendDtmf(input) {
    const webhookUrl = this.callWebhookUrls.get(input.providerCallId);
    if (!webhookUrl)
      throw new Error("Missing webhook URL for this call (provider state not initialized)");
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play digits="${escapeXml(input.digits)}" />
  <Redirect method="POST">${escapeXml(webhookUrl)}</Redirect>
</Response>`;
    await this.updateLiveCallTwiml(input.providerCallId, twiml, "sendDtmf");
  }
  /**
   * Play TTS via core TTS and Twilio Media Streams.
   * Generates audio with core TTS, converts to mu-law, and streams via WebSocket.
   * Uses a queue to serialize playback and prevent overlapping audio.
   */
  async playTtsViaStream(text, streamSid) {
    if (!this.ttsProvider || !this.mediaStreamHandler)
      throw new Error("TTS provider and media stream handler required");
    const CHUNK_SIZE = 160;
    const CHUNK_DELAY_MS = 20;
    const SILENCE_CHUNK = Buffer.alloc(CHUNK_SIZE, 255);
    const handler = this.mediaStreamHandler;
    const ttsProvider = this.ttsProvider;
    const normalizeSendResult = (raw) => {
      if (!raw || typeof raw !== "object") return { sent: true };
      const typed = raw;
      return { sent: typed.sent === void 0 ? true : Boolean(typed.sent) };
    };
    const sendAudioChunk = (audio) => {
      const raw = handler.sendAudio(streamSid, audio);
      return normalizeSendResult(raw);
    };
    const sendPlaybackMark = (name) => {
      const raw = handler.sendMark(streamSid, name);
      return normalizeSendResult(raw);
    };
    await handler.queueTts(streamSid, async (signal) => {
      const sendKeepAlive = () => {
        sendAudioChunk(SILENCE_CHUNK);
      };
      sendKeepAlive();
      const keepAlive = setInterval(() => {
        if (!signal.aborted) sendKeepAlive();
      }, CHUNK_DELAY_MS);
      let muLawAudio;
      let synthTimeout = null;
      const synthTimeoutMs = ttsProvider.synthesisTimeoutMs;
      try {
        const synthPromise = ttsProvider.synthesizeForTelephony(text);
        const timeoutPromise = new Promise((_, reject) => {
          synthTimeout = setTimeout(() => {
            reject(
              /* @__PURE__ */ new Error(
                `Telephony TTS synthesis timed out after ${synthTimeoutMs}ms`,
              ),
            );
          }, synthTimeoutMs);
        });
        muLawAudio = await Promise.race([synthPromise, timeoutPromise]);
      } finally {
        if (synthTimeout) clearTimeout(synthTimeout);
        clearInterval(keepAlive);
      }
      if (muLawAudio.length === 0) throw new Error("Telephony TTS produced no audio");
      let chunkAttempts = 0;
      let chunkDelivered = 0;
      let nextChunkDueAt = Date.now() + CHUNK_DELAY_MS;
      for (const chunk of chunkAudio(muLawAudio, CHUNK_SIZE)) {
        if (signal.aborted) break;
        chunkAttempts += 1;
        if (sendAudioChunk(chunk).sent) chunkDelivered += 1;
        const waitMs = nextChunkDueAt - Date.now();
        if (waitMs > 0)
          await new Promise((resolve) => {
            setTimeout(resolve, Math.ceil(waitMs));
          });
        nextChunkDueAt += CHUNK_DELAY_MS;
        if (signal.aborted) break;
      }
      let markSent = true;
      if (!signal.aborted) markSent = sendPlaybackMark(`tts-${Date.now()}`).sent;
      if (!signal.aborted && chunkAttempts > 0 && (chunkDelivered === 0 || !markSent)) {
        const failures = [];
        if (chunkDelivered === 0) failures.push("no audio chunks delivered");
        if (!markSent) failures.push("completion mark not delivered");
        throw new Error(`Telephony stream playback failed: ${failures.join("; ")}`);
      }
    });
  }
  /**
   * Start listening for speech via Twilio <Gather>.
   */
  async startListening(input) {
    const webhookUrl = this.callWebhookUrls.get(input.providerCallId);
    if (!webhookUrl)
      throw new Error("Missing webhook URL for this call (provider state not initialized)");
    const actionUrl = new URL(webhookUrl);
    if (input.turnToken) actionUrl.searchParams.set("turnToken", input.turnToken);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" speechTimeout="auto" language="${input.language || "en-US"}" action="${escapeXml(actionUrl.toString())}" method="POST">
  </Gather>
</Response>`;
    await this.updateLiveCallTwiml(input.providerCallId, twiml, "startListening");
  }
  /**
   * Stop listening - for Twilio this is a no-op as <Gather> auto-ends.
   */
  async stopListening(_input) {}
  async getCallStatus(input) {
    try {
      const data = await guardedJsonApiRequest({
        url: `${this.baseUrl}/Calls/${input.providerCallId}.json`,
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")}`,
        },
        allowNotFound: true,
        allowedHostnames: [new URL(this.baseUrl).hostname],
        auditContext: "twilio-get-call-status",
        errorPrefix: "Twilio get call status error",
      });
      if (!data)
        return {
          status: "not-found",
          isTerminal: true,
        };
      const status = normalizeProviderStatus(data.status);
      return {
        status,
        isTerminal: isProviderStatusTerminal(status),
      };
    } catch {
      return {
        status: "error",
        isTerminal: false,
        isUnknown: true,
      };
    }
  }
};
//#endregion
export { TwilioProvider };
