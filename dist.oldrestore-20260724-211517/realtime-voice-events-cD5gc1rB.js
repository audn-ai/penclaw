import { _ as readXaiRealtimeErrorDetail } from "./realtime-voice-config-gV0iEKp_.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as XaiRealtimeVoiceProtocol } from "./realtime-voice-protocol-DLTo87tk.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/xai/realtime-voice-events.ts
var XaiRealtimeVoiceEvents = class extends XaiRealtimeVoiceProtocol {
  constructor(..._args) {
    super(..._args);
    this.assistantTranscriptBuffer = "";
    this.assistantTranscriptFinalized = false;
    this.inputTranscriptReplacements = /* @__PURE__ */ new Map();
  }
  handleEvent(event) {
    this.config.onEvent?.({
      direction: "server",
      type: event.type,
      detail: this.describeServerEvent(event),
      ...(event.item_id ? { itemId: event.item_id } : {}),
      ...((event.response_id ?? event.response?.id)
        ? { responseId: event.response_id ?? event.response?.id }
        : {}),
    });
    switch (event.type) {
      case "session.created":
        return;
      case "conversation.created": {
        const conversationId = normalizeOptionalString(event.conversation?.id);
        if (conversationId) this.conversationId = conversationId;
        return;
      }
      case "conversation.item.created":
      case "conversation.item.added": {
        const item = event.item;
        const callId = normalizeOptionalString(item?.call_id);
        if (item?.type === "function_call_output" && callId) {
          this.pendingToolResultAcks.delete(callId);
          return;
        }
        if (event.type === "conversation.item.created" && item?.type === "function_call")
          this.emitToolCallOnce({
            itemId: item.id ?? event.item_id,
            callId: item.call_id,
            name: item.name,
            rawArgs: item.arguments,
          });
        return;
      }
      case "session.updated":
        this.onSessionUpdated();
        return;
      case "response.created":
        this.responseActive = true;
        this.responseCreateInFlight = false;
        this.markQueue = [];
        this.lastAssistantItemId = null;
        this.responseStartTimestamp = null;
        this.resetAssistantTranscript();
        return;
      case "response.output_audio.delta": {
        const audioDelta = event.delta ?? event.data;
        if (!audioDelta) return;
        this.config.onAudio(Buffer.from(audioDelta, "base64"));
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
        this.handleServerVadBargeIn();
        return;
      case "response.text.delta":
      case "response.output_text.delta":
      case "response.output_audio_transcript.delta":
        if (event.delta) this.appendAssistantTranscriptDelta(event.delta);
        return;
      case "response.output_text.done":
      case "response.output_audio_transcript.done":
        this.flushAssistantTranscript(event.transcript ?? event.text);
        return;
      case "conversation.item.input_audio_transcription.updated":
        if (event.transcript)
          this.inputTranscriptReplacements.set(this.inputTranscriptKey(event), event.transcript);
        return;
      case "conversation.item.input_audio_transcription.completed": {
        const key = this.inputTranscriptKey(event);
        const transcript = event.transcript ?? this.inputTranscriptReplacements.get(key);
        this.inputTranscriptReplacements.delete(key);
        if (transcript) this.config.onTranscript?.("user", transcript, true);
        return;
      }
      case "response.done":
        this.flushAssistantTranscript();
        this.responseActive = false;
        this.responseCreateInFlight = false;
        this.responseCancelInFlight = false;
        this.flushPendingResponseCreate();
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
      case "error":
        this.handleErrorEvent(event.error);
      default:
    }
  }
  resetInputTranscripts() {
    this.inputTranscriptReplacements.clear();
  }
  appendAssistantTranscriptDelta(delta) {
    if (this.assistantTranscriptFinalized) {
      this.assistantTranscriptBuffer = "";
      this.assistantTranscriptFinalized = false;
    }
    this.assistantTranscriptBuffer += delta;
    this.config.onTranscript?.("assistant", delta, false);
  }
  flushAssistantTranscript(finalTranscript) {
    if (this.assistantTranscriptFinalized) return;
    const transcript = finalTranscript || this.assistantTranscriptBuffer;
    if (transcript) {
      this.config.onTranscript?.("assistant", transcript, true);
      this.assistantTranscriptFinalized = true;
    }
    this.assistantTranscriptBuffer = "";
  }
  resetAssistantTranscript() {
    this.assistantTranscriptBuffer = "";
    this.assistantTranscriptFinalized = false;
  }
  inputTranscriptKey(event) {
    return event.item_id ?? event.response_id ?? "default";
  }
  handleErrorEvent(error) {
    const detail = readXaiRealtimeErrorDetail(error);
    if (detail.startsWith("Conversation already has an active response in progress:")) {
      this.responseActive = true;
      this.responseCreateInFlight = false;
      this.responseCreatePending = true;
      return;
    }
    if (detail === "Cancellation failed: no active response found") {
      this.responseActive = false;
      this.responseCancelInFlight = false;
      this.flushPendingResponseCreate();
      return;
    }
    this.config.onError?.(new Error(detail));
  }
  describeServerEvent(event) {
    if (event.type === "error") return readXaiRealtimeErrorDetail(event.error);
    if (event.type !== "response.done") return;
    const status = event.response?.status;
    const details =
      event.response?.status_details === void 0
        ? void 0
        : JSON.stringify(event.response.status_details);
    return [status ? `status=${status}` : void 0, details].filter(Boolean).join(" ") || void 0;
  }
};
//#endregion
export { XaiRealtimeVoiceEvents as t };
