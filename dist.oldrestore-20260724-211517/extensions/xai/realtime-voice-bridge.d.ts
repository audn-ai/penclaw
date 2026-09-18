import { t as XaiRealtimeVoiceEvents } from "../../realtime-voice-events-9ImUybeC.js";
import {
  Ca as RealtimeVoiceBridge,
  Ra as RealtimeVoiceToolResultOptions,
} from "../../types-Ga3mNO_F.js";

//#region extensions/xai/realtime-voice-bridge.d.ts
declare class XaiRealtimeVoiceBridge extends XaiRealtimeVoiceEvents implements RealtimeVoiceBridge {
  readonly supportsToolResultContinuation = false;
  private ws;
  private connected;
  private sessionConfigured;
  private intentionallyClosed;
  private reconnectAttempts;
  private pendingAudio;
  private pendingToolResults;
  private pendingUserMessages;
  private connectionUrl;
  private readonly flowId;
  private sessionReadyFired;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  setMediaTimestamp(ts: number): void;
  sendUserMessage(text: string): void;
  triggerGreeting(instructions?: string): void;
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void;
  close(): void;
  isConnected(): boolean;
  private doConnect;
  private attemptReconnect;
  private reconnectBlockReason;
  protected onSessionUpdated(): void;
  protected sendEvent(event: unknown, detail?: string): void;
  private canSubmitToolResult;
  private canSubmitInput;
}
//#endregion
export { XaiRealtimeVoiceBridge };
