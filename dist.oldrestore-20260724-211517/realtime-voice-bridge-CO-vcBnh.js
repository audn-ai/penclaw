import { randomUUID } from "node:crypto";
import WebSocket$1 from "ws";
import "./proxy-capture-BPyIb8Rh.js";
import {
  n as createDebugProxyWebSocketAgent,
  r as resolveDebugProxySettings,
} from "./env-CAvwY92q.js";
import {
  _ as readXaiRealtimeErrorDetail,
  n as XAI_REALTIME_BASE_RECONNECT_DELAY_MS,
  p as XAI_REALTIME_WS_MAX_PAYLOAD_BYTES,
  r as XAI_REALTIME_CONNECT_TIMEOUT_MS,
  v as resolveXaiRealtimeApiKey,
  y as toXaiRealtimeWsUrl,
} from "./realtime-voice-config-gV0iEKp_.js";
import { t as XaiRealtimeVoiceEvents } from "./realtime-voice-events-cD5gc1rB.js";
import { n as captureWsEvent } from "./runtime-eYTs6VkC.js";
import { n as xaiUserAgentHeaderFor } from "./xai-user-agent-CGKMBFuk.js";
//#region extensions/xai/realtime-voice-bridge.ts
var XaiRealtimeVoiceBridge = class extends XaiRealtimeVoiceEvents {
  constructor(..._args) {
    super(..._args);
    this.supportsToolResultContinuation = false;
    this.ws = null;
    this.connected = false;
    this.sessionConfigured = false;
    this.intentionallyClosed = false;
    this.reconnectAttempts = 0;
    this.pendingAudio = [];
    this.pendingToolResults = [];
    this.pendingUserMessages = [];
    this.connectionUrl = "";
    this.flowId = randomUUID();
    this.sessionReadyFired = false;
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
    if (!this.canSubmitInput()) {
      if (this.pendingUserMessages.length < 128) this.pendingUserMessages.push(text);
      else
        this.config.onError?.(
          /* @__PURE__ */ new Error(
            "xAI realtime voice pending user message queue overflow during reconnect",
          ),
        );
      return;
    }
    this.sendUserMessageNow(text);
  }
  triggerGreeting(instructions) {
    if (this.isConnected() && this.ws)
      this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the user.");
  }
  submitToolResult(callId, result, options) {
    if (!this.canSubmitToolResult()) {
      if (this.pendingToolResults.length < 128)
        this.pendingToolResults.push({
          callId,
          result,
          ...(options ? { options } : {}),
        });
      else
        this.config.onError?.(
          /* @__PURE__ */ new Error(
            "xAI realtime voice pending tool result queue overflow during reconnect",
          ),
        );
      return;
    }
    this.submitToolResultNow(callId, result, options);
  }
  close() {
    this.intentionallyClosed = true;
    this.connected = false;
    this.sessionConfigured = false;
    this.pendingToolResultAcks.clear();
    if (this.ws) {
      this.ws.close(1e3, "Bridge closed");
      this.ws = null;
    }
  }
  isConnected() {
    return this.connected && this.sessionConfigured;
  }
  async doConnect() {
    const apiKey = this.config.resolveApiKey
      ? await this.config.resolveApiKey()
      : await resolveXaiRealtimeApiKey(this.config.apiKey, this.config.cfg);
    const model = this.config.model ?? "grok-voice-latest";
    const url = toXaiRealtimeWsUrl(
      this.config.baseUrl,
      model,
      this.config.sessionResumption === true ? (this.conversationId ?? void 0) : void 0,
    );
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      ...xaiUserAgentHeaderFor(this.config.baseUrl),
    };
    await new Promise((resolve, reject) => {
      let settled = false;
      let startupFailureClosing = false;
      const settleResolve = () => {
        if (!settled) {
          settled = true;
          clearTimeout(connectTimeout);
          resolve();
        }
      };
      const settleReject = (error) => {
        if (!settled) {
          settled = true;
          clearTimeout(connectTimeout);
          reject(error);
        }
      };
      const connectTimeout = setTimeout(() => {
        if (!this.sessionConfigured && !this.intentionallyClosed) {
          startupFailureClosing = true;
          this.ws?.terminate();
          settleReject(/* @__PURE__ */ new Error("xAI realtime voice connection timeout"));
        }
      }, XAI_REALTIME_CONNECT_TIMEOUT_MS);
      if (this.intentionallyClosed) {
        settleResolve();
        return;
      }
      this.connectionUrl = url;
      const proxyAgent = createDebugProxyWebSocketAgent(resolveDebugProxySettings());
      const ws = new WebSocket$1(url, {
        headers,
        maxPayload: XAI_REALTIME_WS_MAX_PAYLOAD_BYTES,
        ...(proxyAgent ? { agent: proxyAgent } : {}),
      });
      this.ws = ws;
      const rejectStartup = (error) => {
        startupFailureClosing = true;
        settleReject(error);
        if (ws.readyState !== WebSocket$1.CLOSED) ws.close(1e3, "startup failed");
      };
      ws.on("open", () => {
        this.resetRealtimeSessionState({
          preserveToolCallState:
            this.config.sessionResumption === true && this.conversationId !== null,
        });
        this.connected = true;
        this.sessionConfigured = false;
        captureWsEvent({
          url,
          direction: "local",
          kind: "ws-open",
          flowId: this.flowId,
          meta: {
            provider: "xai",
            capability: "realtime-voice",
          },
        });
        this.sendEvent(this.buildSessionUpdate());
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
            provider: "xai",
            capability: "realtime-voice",
          },
        });
        try {
          const event = JSON.parse(data.toString());
          if (event.type === "error" && !this.sessionConfigured) {
            rejectStartup(new Error(readXaiRealtimeErrorDetail(event.error)));
            return;
          }
          this.handleEvent(event);
          if (event.type === "session.updated") settleResolve();
        } catch (error) {
          console.error("[xai] realtime event parse failed:", error);
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
            provider: "xai",
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
        captureWsEvent({
          url,
          direction: "local",
          kind: "ws-close",
          flowId: this.flowId,
          closeCode: typeof code === "number" ? code : void 0,
          meta: {
            provider: "xai",
            capability: "realtime-voice",
            reason:
              Buffer.isBuffer(reasonBuffer) && reasonBuffer.length > 0
                ? reasonBuffer.toString("utf8")
                : void 0,
          },
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
            /* @__PURE__ */ new Error("xAI realtime voice connection closed before ready"),
          );
          return;
        }
        this.attemptReconnect("websocket-close");
      });
    });
  }
  async attemptReconnect(reason) {
    if (this.intentionallyClosed) return;
    const blocked = this.reconnectBlockReason();
    if (blocked) {
      this.config.onEvent?.({
        direction: "client",
        type: "session.reconnect.blocked",
        detail: `reason=${reason} ${blocked}`,
      });
      this.config.onClose?.("error");
      return;
    }
    if (this.reconnectAttempts >= 5) {
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
    const delay = XAI_REALTIME_BASE_RECONNECT_DELAY_MS * 2 ** (attempt - 1);
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
  reconnectBlockReason() {
    if (this.config.sessionResumption !== true) return "sessionResumption=false";
    if (this.pendingToolResultAcks.size > 0)
      return `unacknowledgedToolResults=${this.pendingToolResultAcks.size}`;
    if (!this.conversationId) return "missingConversationId=true";
  }
  onSessionUpdated() {
    this.sessionConfigured = true;
    this.reconnectAttempts = 0;
    for (const chunk of this.pendingAudio.splice(0)) this.sendAudio(chunk);
    for (const pending of this.pendingToolResults.splice(0))
      this.submitToolResultNow(pending.callId, pending.result, pending.options);
    for (const message of this.pendingUserMessages.splice(0)) this.sendUserMessageNow(message);
    if (!this.sessionReadyFired) {
      this.sessionReadyFired = true;
      this.config.onReady?.();
    }
  }
  sendEvent(event, detail) {
    const ws = this.ws;
    if (ws?.readyState !== WebSocket$1.OPEN) return;
    const type =
      event && typeof event === "object" && typeof event.type === "string" ? event.type : "unknown";
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
        provider: "xai",
        capability: "realtime-voice",
      },
    });
    ws.send(payload);
  }
  canSubmitToolResult() {
    return this.connected && this.sessionConfigured && this.ws?.readyState === WebSocket$1.OPEN;
  }
  canSubmitInput() {
    return this.connected && this.sessionConfigured && this.ws?.readyState === WebSocket$1.OPEN;
  }
};
//#endregion
export { XaiRealtimeVoiceBridge as t };
